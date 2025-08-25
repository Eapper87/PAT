import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const callId = searchParams.get('callId')
    const userId = searchParams.get('userId')

    if (!callId || !userId) {
      return NextResponse.json(
        { error: 'Call ID and User ID are required' },
        { status: 400 }
      )
    }

    // Get call details
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

    // Calculate current server duration if call is active
    let currentServerDuration = call.server_duration || 0
    if (call.status === 'active' || call.status === 'initiated') {
      const now = new Date()
      const sessionStart = new Date(call.session_started_at!)
      currentServerDuration = Math.floor((now.getTime() - sessionStart.getTime()) / 1000)
    }

    // Calculate credits used and remaining
    const creditsUsed = Math.ceil(currentServerDuration / 60)
    const creditsRemaining = Math.max(0, (call.credits_reserved || 0) - creditsUsed)

    // Get user's current credit balance
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('credits')
      .eq('id', userId)
      .single()

    if (userError) {
      console.error('Error fetching user credits:', userError)
    }

    return NextResponse.json({
      callId: call.id,
      status: call.status,
      agentId: call.agent_id,
      sessionStarted: call.session_started_at,
      lastHeartbeat: call.last_heartbeat,
      serverDuration: currentServerDuration,
      clientDuration: call.duration || 0,
      processingStatus: call.processing_status,
      webhookReceived: call.webhook_received,
      elevenlabsProcessingTime: call.elevenlabs_processing_time,
      creditsReserved: call.credits_reserved || 0,
      creditsUsed,
      creditsRemaining,
      userCredits: user?.credits || 0,
      cost: Math.ceil(currentServerDuration / 60),
      isActive: call.status === 'active' || call.status === 'initiated',
      nextHeartbeatIn: call.status === 'active' ? 30 : null
    })

  } catch (error: any) {
    console.error('Error getting call status:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get call status' },
      { status: 500 }
    )
  }
}
