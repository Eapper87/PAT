import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { callId, userId, clientDuration, trackingMethod } = await request.json()
    
    if (!callId || !userId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    console.log('🛑 [Call End] Ending call session:', { callId, userId, clientDuration, trackingMethod })

    // Find the call record
    const { data: call, error: callError } = await supabase
      .from('calls')
      .select('*')
      .eq('id', callId)
      .eq('user_id', userId)
      .single()

    if (callError || !call) {
      console.error('❌ [Call End] Call not found:', { callId, userId, error: callError })
      return NextResponse.json({ error: 'Call not found' }, { status: 404 })
    }

    if (call.status === 'completed') {
      console.log('⚠️ [Call End] Call already completed:', callId)
      return NextResponse.json({ success: true, message: 'Call already completed' })
    }

    // Update call with end time and client duration
    const { error: updateError } = await supabase
      .from('calls')
      .update({
        status: 'completed',
        ended_at: new Date().toISOString(),
        duration: clientDuration || 0,
        cost: Math.ceil((clientDuration || 0) / 60), // 1 credit per minute
        client_duration: clientDuration || 0,
        tracking_method: trackingMethod || 'manual',
        final_duration_source: 'client_side'
      })
      .eq('id', callId)

    if (updateError) {
      console.error('❌ [Call End] Error updating call:', updateError)
      return NextResponse.json({ error: 'Failed to update call' }, { status: 500 })
    }

    console.log('✅ [Call End] Call session ended successfully:', callId)

    return NextResponse.json({
      success: true,
      callId,
      status: 'completed',
      duration: clientDuration,
      cost: Math.ceil((clientDuration || 0) / 60)
    })

  } catch (error) {
    console.error('💥 [Call End] Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
