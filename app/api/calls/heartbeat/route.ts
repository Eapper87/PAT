import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { callId, userId } = await request.json()
    
    if (!callId || !userId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    console.log('💓 [Call Heartbeat] Processing heartbeat:', { callId, userId })

    // Find the call record
    const { data: call, error: callError } = await supabase
      .from('calls')
      .select('*')
      .eq('id', callId)
      .eq('user_id', userId)
      .single()

    if (callError || !call) {
      console.error('❌ [Call Heartbeat] Call not found:', { callId, userId, error: callError })
      return NextResponse.json({ error: 'Call not found' }, { status: 404 })
    }

    if (call.status !== 'active') {
      console.log('⚠️ [Call Heartbeat] Call not active:', { callId, status: call.status })
      return NextResponse.json({ 
        callEnded: true, 
        error: 'Call is not active',
        status: call.status 
      })
    }

    // Update last heartbeat time
    const { error: updateError } = await supabase
      .from('calls')
      .update({
        last_heartbeat: new Date().toISOString()
      })
      .eq('id', callId)

    if (updateError) {
      console.error('❌ [Call Heartbeat] Error updating heartbeat:', updateError)
      return NextResponse.json({ error: 'Failed to update heartbeat' }, { status: 500 })
    }

    console.log('✅ [Call Heartbeat] Heartbeat processed successfully:', callId)

    return NextResponse.json({
      success: true,
      callId,
      status: call.status,
      lastHeartbeat: new Date().toISOString()
    })

  } catch (error) {
    console.error('💥 [Call Heartbeat] Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
