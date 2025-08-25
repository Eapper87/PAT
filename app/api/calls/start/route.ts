import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { userId, agentId } = await req.json()

    if (!userId || !agentId) {
      return NextResponse.json(
        { error: 'User ID and Agent ID are required' },
        { status: 400 }
      )
    }

    // Check if user has sufficient credits
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('credits')
      .eq('id', userId)
      .single()

    if (userError || !user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    if (user.credits < 1) {
      return NextResponse.json(
        { error: 'Insufficient credits' },
        { status: 402 }
      )
    }

    // Check if user already has an active call
    const { data: activeCall } = await supabase
      .from('calls')
      .select('id')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single()

    if (activeCall) {
      return NextResponse.json(
        { error: 'User already has an active call' },
        { status: 409 }
      )
    }

    // Reserve 1 credit for the call (minimum)
    const creditsToReserve = Math.min(user.credits, 1)
    
    // Create new call record
    const { data: call, error: callError } = await supabase
      .from('calls')
      .insert([
        {
          user_id: userId,
          agent_id: agentId,
          status: 'initiated',
          duration: 0,
          cost: 0,
          session_started_at: new Date().toISOString(),
          last_heartbeat: new Date().toISOString(),
          processing_status: 'pending',
          webhook_received: false,
          credits_reserved: creditsToReserve
        }
      ])
      .select()
      .single()

    if (callError) {
      console.error('Error creating call:', callError)
      return NextResponse.json(
        { error: 'Failed to create call session' },
        { status: 500 }
      )
    }

    // Reserve credits by deducting them from user balance
    const { error: creditError } = await supabase
      .from('users')
      .update({
        credits: user.credits - creditsToReserve
      })
      .eq('id', userId)

    if (creditError) {
      console.error('Error reserving credits:', creditError)
      // Rollback call creation if credit reservation fails
      await supabase
        .from('calls')
        .delete()
        .eq('id', call.id)
      
      return NextResponse.json(
        { error: 'Failed to reserve credits' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      callId: call.id,
      creditsReserved: creditsToReserve,
      remainingCredits: user.credits - creditsToReserve,
      sessionStarted: call.session_started_at
    })

  } catch (error: any) {
    console.error('Error starting call session:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to start call session' },
      { status: 500 }
    )
  }
}
