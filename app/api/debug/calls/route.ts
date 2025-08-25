import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 [Debug] Checking calls table...')

    // Check if table exists by trying to select from it
    const { data: calls, error } = await supabase
      .from('calls')
      .select('*')
      .limit(5)

    if (error) {
      console.error('❌ [Debug] Error accessing calls table:', error)
      return NextResponse.json({ 
        error: 'Calls table error', 
        details: error.message,
        code: error.code 
      }, { status: 500 })
    }

    console.log('✅ [Debug] Calls table accessible, found calls:', calls?.length || 0)

    return NextResponse.json({
      success: true,
      callsCount: calls?.length || 0,
      sampleCalls: calls || [],
      message: 'Calls table is accessible'
    })

  } catch (error) {
    console.error('💥 [Debug] Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, agentId } = await request.json()
    
    if (!userId || !agentId) {
      return NextResponse.json({ error: 'Missing userId or agentId' }, { status: 400 })
    }

    console.log('🧪 [Debug] Testing call creation:', { userId, agentId })

    // Try to create a test call record
    const { data: testCall, error } = await supabase
      .from('calls')
      .insert([
        {
          user_id: userId,
          agent_id: agentId,
          status: 'completed',
          duration: 120, // 2 minutes
          cost: 2,
          started_at: new Date().toISOString(),
          ended_at: new Date().toISOString(),
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single()

    if (error) {
      console.error('❌ [Debug] Error creating test call:', error)
      return NextResponse.json({ 
        error: 'Failed to create test call', 
        details: error.message 
      }, { status: 500 })
    }

    console.log('✅ [Debug] Test call created successfully:', testCall.id)

    return NextResponse.json({
      success: true,
      testCallId: testCall.id,
      message: 'Test call created successfully'
    })

  } catch (error) {
    console.error('💥 [Debug] Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
