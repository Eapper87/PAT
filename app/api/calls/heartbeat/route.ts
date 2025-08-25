import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { callId, userId } = await req.json()

    if (!callId || !userId) {
      return NextResponse.json(
        { error: 'Call ID and User ID are required' },
        { status: 400 }
      )
    }

    // Verify call exists and belongs to user
    const { data: call, error: callError } = await supabase
      .from('calls')
      .select('*')
      .eq('id', callId)
      .eq('user_id', userId)
      .single()

    if (callError || !call) {
      return NextResponse.json(
        { error: 'Call not found' },
        { status: 404 }
      )
    }

    // Check if call is still active
    if (call.status !== 'active' && call.status !== 'initiated') {
      return NextResponse.json(
        { error: 'Call is not active' },
        { status: 400 }
      )
    }

    const now = new Date()
    const sessionStart = new Date(call.session_started_at!)
    const serverDuration = Math.floor((now.getTime() - sessionStart.getTime()) / 1000)

    // Calculate additional credits needed (1 credit per minute)
    const minutesElapsed = Math.ceil(serverDuration / 60)
    const creditsNeeded = Math.max(0, minutesElapsed - (call.credits_reserved || 0))

    // Check if user has enough credits for additional time
    if (creditsNeeded > 0) {
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

      if (user.credits < creditsNeeded) {
        // Not enough credits - end call
        await supabase
          .from('calls')
          .update({
            status: 'failed',
            ended_at: now.toISOString(),
            server_duration: serverDuration,
            cost: Math.ceil(serverDuration / 60)
          })
          .eq('id', callId)

        return NextResponse.json({
          error: 'Insufficient credits',
          callEnded: true,
          duration: serverDuration,
          creditsUsed: Math.ceil(serverDuration / 60)
        }, { status: 402 })
      }

      // Reserve additional credits
      const { error: creditError } = await supabase
        .from('users')
        .update({
          credits: user.credits - creditsNeeded
        })
        .eq('id', userId)

      if (creditError) {
        console.error('Error reserving additional credits:', creditError)
        return NextResponse.json(
          { error: 'Failed to reserve credits' },
          { status: 500 }
        )
      }

      // Update call with additional reserved credits
      await supabase
        .from('calls')
        .update({
          credits_reserved: (call.credits_reserved || 0) + creditsNeeded
        })
        .eq('id', callId)
    }

    // Update call heartbeat and server duration
    const { error: updateError } = await supabase
      .from('calls')
      .update({
        last_heartbeat: now.toISOString(),
        server_duration: serverDuration
      })
      .eq('id', callId)

    if (updateError) {
      console.error('Error updating call heartbeat:', updateError)
      return NextResponse.json(
        { error: 'Failed to update call heartbeat' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      callId,
      serverDuration,
      creditsReserved: (call.credits_reserved || 0) + creditsNeeded,
      nextHeartbeatIn: 30 // seconds
    })

  } catch (error: any) {
    console.error('Error processing call heartbeat:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to process heartbeat' },
      { status: 500 }
    )
  }
}
