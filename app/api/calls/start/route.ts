import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { userId, agentId } = await req.json()
    
    console.log('🚀 [API] Starting call session:', {
      userId,
      agentId,
      timestamp: new Date().toISOString()
    })

    if (!userId || !agentId) {
      console.error('❌ [API] Missing required fields:', { userId, agentId })
      return NextResponse.json(
        { error: 'User ID and Agent ID are required' },
        { status: 400 }
      )
    }

    // Check if user has sufficient credits
    console.log('🔍 [API] Checking user credits...', { userId })
    
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('credits')
      .eq('id', userId)
      .single()

    if (userError || !user) {
      console.error('❌ [API] User not found:', { userId, error: userError })
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    console.log('✅ [API] User found:', { userId, credits: user.credits })

    if (user.credits < 1) {
      console.error('❌ [API] Insufficient credits:', { userId, credits: user.credits })
      return NextResponse.json(
        { error: 'Insufficient credits' },
        { status: 402 }
      )
    }

    // Check if user already has an active call
    console.log('🔍 [API] Checking for active calls...', { userId })
    
    const { data: activeCall } = await supabase
      .from('calls')
      .select('id')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single()

    if (activeCall) {
      console.error('❌ [API] User already has active call:', { userId, activeCallId: activeCall.id })
      return NextResponse.json(
        { error: 'User already has an active call' },
        { status: 409 }
      )
    }

    console.log('✅ [API] No active calls found')

    // Reserve 1 credit for the call (minimum)
    const creditsToReserve = Math.min(user.credits, 1)
    console.log('💰 [API] Reserving credits:', { 
      userId, 
      currentCredits: user.credits, 
      creditsToReserve 
    })
    
    // Create new call record
    console.log('📝 [API] Creating call record...')
    
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
      console.error('❌ [API] Error creating call:', callError)
      return NextResponse.json(
        { error: 'Failed to create call session' },
        { status: 500 }
      )
    }

    console.log('✅ [API] Call record created:', { callId: call.id })

    // Reserve credits by deducting them from user balance
    console.log('💰 [API] Deducting credits from user...', { 
      userId, 
      currentCredits: user.credits, 
      creditsToReserve,
      newCredits: user.credits - creditsToReserve
    })
    
    const { error: creditError } = await supabase
      .from('users')
      .update({
        credits: user.credits - creditsToReserve
      })
      .eq('id', userId)

    if (creditError) {
      console.error('❌ [API] Error reserving credits:', creditError)
      // Rollback call creation if credit reservation fails
      console.log('🔄 [API] Rolling back call creation...')
      await supabase
        .from('calls')
        .delete()
        .eq('id', call.id)
      
      return NextResponse.json(
        { error: 'Failed to reserve credits' },
        { status: 500 }
      )
    }

    console.log('✅ [API] Credits reserved successfully')

    const response = {
      callId: call.id,
      creditsReserved: creditsToReserve,
      remainingCredits: user.credits - creditsToReserve,
      sessionStarted: call.session_started_at
    }

    console.log('🎯 [API] Call session started successfully:', response)
    return NextResponse.json(response)

  } catch (error: any) {
    console.error('Error starting call session:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to start call session' },
      { status: 500 }
    )
  }
}
