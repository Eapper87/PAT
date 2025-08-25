import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { userId, agentId } = await request.json()
    
    if (!userId || !agentId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    console.log('🎬 [Call Start] Starting call session:', { userId, agentId })

    // Create new call record
    const { data: call, error } = await supabase
      .from('calls')
      .insert([
        {
          user_id: userId,
          agent_id: agentId,
          status: 'active',
          started_at: new Date().toISOString(),
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single()

    if (error) {
      console.error('❌ [Call Start] Database error:', error)
      return NextResponse.json({ error: 'Failed to create call record' }, { status: 500 })
    }

    console.log('✅ [Call Start] Call session created:', call.id)

    return NextResponse.json({
      success: true,
      callId: call.id,
      status: call.status
    })

  } catch (error) {
    console.error('💥 [Call Start] Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
