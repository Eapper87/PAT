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

    // Calculate cost based on billing rules: first 3 minutes free, then $1 per minute
    const durationMinutes = Math.ceil(clientDuration / 60)
    let cost = 0
    
    if (durationMinutes > 3) {
      // First 3 minutes free, charge for additional minutes
      const chargeableMinutes = durationMinutes - 3
      cost = chargeableMinutes * 1 // $1 per minute
    }

    console.log('💰 [Call End] Billing calculation:', { 
      durationMinutes, 
      cost, 
      freeMinutes: 3, 
      chargeableMinutes: Math.max(0, durationMinutes - 3) 
    })

    // Update call with end time and calculated cost
    const { error: updateError } = await supabase
      .from('calls')
      .update({
        status: 'completed',
        ended_at: new Date().toISOString(),
        duration: clientDuration || 0,
        cost: cost,
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
      cost: cost,
      billingInfo: {
        totalMinutes: durationMinutes,
        freeMinutes: 3,
        chargeableMinutes: Math.max(0, durationMinutes - 3),
        ratePerMinute: 1
      }
    })

  } catch (error) {
    console.error('💥 [Call End] Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
