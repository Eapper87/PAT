import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { callId, userId, clientDuration } = await req.json()

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

    // Check if call can be ended
    if (call.status === 'completed' || call.status === 'failed') {
      return NextResponse.json(
        { error: 'Call has already ended' },
        { status: 400 }
      )
    }

    const now = new Date()
    const sessionStart = new Date(call.session_started_at!)
    const serverDuration = Math.floor((now.getTime() - sessionStart.getTime()) / 1000)

    // Use server duration as primary, client duration as fallback
    const finalDuration = call.server_duration || serverDuration || clientDuration || 0
    const finalCost = Math.ceil(finalDuration / 60) // 1 credit per minute

    // Calculate credits to return (if we reserved more than needed)
    const creditsReserved = call.credits_reserved || 0
    const creditsToReturn = Math.max(0, creditsReserved - finalCost)

    // Update call record
    const { error: updateError } = await supabase
      .from('calls')
      .update({
        status: 'completed',
        ended_at: now.toISOString(),
        duration: finalDuration,
        cost: finalCost,
        server_duration: finalDuration
      })
      .eq('id', callId)

    if (updateError) {
      console.error('Error updating call:', updateError)
      return NextResponse.json(
        { error: 'Failed to update call' },
        { status: 500 }
      )
    }

    // Return unused credits to user
    if (creditsToReturn > 0) {
      const { error: creditError } = await supabase
        .from('users')
        .update({
          credits: supabase.rpc('increment', { 
            row_id: userId, 
            x: creditsToReturn 
          })
        })
        .eq('id', userId)

      if (creditError) {
        console.error('Error returning credits:', creditError)
        // Don't fail the call end if credit return fails
      }
    }

    // Create transaction record for the call
    await supabase
      .from('transactions')
      .insert([
        {
          user_id: userId,
          stripe_id: `call_${callId}`,
          amount: -finalCost, // Negative amount for credit usage
          type: 'credits',
          status: 'completed'
        }
      ])

    return NextResponse.json({
      success: true,
      callId,
      finalDuration,
      finalCost,
      creditsUsed: finalCost,
      creditsReturned: creditsToReturn,
      callEnded: true
    })

  } catch (error: any) {
    console.error('Error ending call:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to end call' },
      { status: 500 }
    )
  }
}
