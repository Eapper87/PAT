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

    // Free tier: 3 minutes max per call, no overtime billing
    const durationMinutes = Math.ceil(clientDuration / 60)
    let cost = 0
    let status = 'completed'
    let billingNote = ''
    
    if (durationMinutes > 3) {
      // Free tier exceeded - call is limited to 3 minutes
      const actualDuration = 3 * 60 // 3 minutes in seconds
      cost = 0 // No charge for free tier
      status = 'limited' // Mark as limited instead of completed
      billingNote = 'Free tier limit reached (3 minutes)'
      
      console.log('⚠️ [Call End] Free tier limit reached:', { 
        requestedMinutes: durationMinutes, 
        allowedMinutes: 3,
        actualDurationSeconds: actualDuration,
        cost: 0
      })
    } else {
      // Within free tier limits
      billingNote = 'Free tier call'
      console.log('✅ [Call End] Free tier call completed:', { 
        durationMinutes, 
        cost: 0 
      })
    }

    // Update call with end time and billing info
    const { error: updateError } = await supabase
      .from('calls')
      .update({
        status: status,
        ended_at: new Date().toISOString(),
        duration: status === 'limited' ? 3 * 60 : clientDuration, // Use actual duration
        cost: cost,
        client_duration: clientDuration || 0,
        tracking_method: trackingMethod || 'manual',
        final_duration_source: 'client_side',
        billing_note: billingNote
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
      status: status,
      duration: status === 'limited' ? 3 * 60 : clientDuration,
      cost: cost,
      billingInfo: {
        tier: 'free',
        maxMinutes: 3,
        actualMinutes: status === 'limited' ? 3 : durationMinutes,
        requestedMinutes: durationMinutes,
        cost: 0,
        note: billingNote
      }
    })

  } catch (error) {
    console.error('💥 [Call End] Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
