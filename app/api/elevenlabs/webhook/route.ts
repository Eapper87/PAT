import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import crypto from 'crypto'

// Webhook secret from ElevenLabs dashboard
const WEBHOOK_SECRET = process.env.ELEVENLABS_WEBHOOK_SECRET

interface ElevenLabsWebhook {
  agent_id: string
  conversation_id: string
  user_id?: string
  duration_seconds: number
  started_at: string
  ended_at: string
  status: 'completed' | 'failed' | 'cancelled'
  // Add other fields as needed based on ElevenLabs docs
}

export async function POST(request: NextRequest) {
  try {
    console.log('🎤 [ElevenLabs Webhook] Received webhook request')
    
    const body = await request.text()
    const signature = request.headers.get('elevenlabs-signature')
    
    // Verify webhook signature if secret is provided
    if (WEBHOOK_SECRET && signature) {
      const expectedSignature = crypto
        .createHmac('sha256', WEBHOOK_SECRET)
        .update(body)
        .digest('hex')
      
      if (signature !== expectedSignature) {
        console.error('❌ [ElevenLabs Webhook] Invalid signature')
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
      }
    }
    
    const webhookData: ElevenLabsWebhook = JSON.parse(body)
    console.log('📝 [ElevenLabs Webhook] Webhook payload:', webhookData)
    
    // Process the webhook data
    await processWebhookData(webhookData)
    
    return NextResponse.json({ success: true })
    
  } catch (error) {
    console.error('💥 [ElevenLabs Webhook] Error processing webhook:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function processWebhookData(data: ElevenLabsWebhook) {
  try {
    console.log('🎬 [ElevenLabs Webhook] Processing webhook data:', {
      agentId: data.agent_id,
      conversationId: data.conversation_id,
      duration: data.duration_seconds,
      status: data.status,
      startedAt: data.started_at,
      endedAt: data.ended_at
    })
    
    // Find the corresponding active call in your database
    const { data: activeCall, error: callError } = await supabase
      .from('calls')
      .select('*')
      .eq('agent_id', data.agent_id)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()
    
    if (callError) {
      console.error('❌ [ElevenLabs Webhook] Error finding active call:', callError)
      return
    }
    
    if (activeCall) {
      // Update call with official duration from ElevenLabs
      console.log('✅ [ElevenLabs Webhook] Updating call with webhook data:', activeCall.id)
      
      const { error: updateError } = await supabase
        .from('calls')
        .update({
          status: 'completed',
          duration: data.duration_seconds,
          cost: Math.ceil(data.duration_seconds / 60), // 1 credit per minute
          ended_at: data.ended_at,
          webhook_received: true,
          elevenlabs_conversation_id: data.conversation_id,
          elevenlabs_processing_time: data.duration_seconds,
          final_duration_source: 'elevenlabs_webhook'
        })
        .eq('id', activeCall.id)
      
      if (updateError) {
        console.error('❌ [ElevenLabs Webhook] Error updating call:', updateError)
      } else {
        console.log('✅ [ElevenLabs Webhook] Call updated successfully with webhook data')
      }
    } else {
      console.warn('⚠️ [ElevenLabs Webhook] No active call found for agent:', data.agent_id)
      
      // Create a new call record if none exists (fallback)
      const { error: insertError } = await supabase
        .from('calls')
        .insert({
          agent_id: data.agent_id,
          user_id: data.user_id || 'unknown',
          status: 'completed',
          duration: data.duration_seconds,
          cost: Math.ceil(data.duration_seconds / 60),
          started_at: data.started_at,
          ended_at: data.ended_at,
          webhook_received: true,
          elevenlabs_conversation_id: data.conversation_id,
          elevenlabs_processing_time: data.duration_seconds,
          final_duration_source: 'elevenlabs_webhook_fallback'
        })
      
      if (insertError) {
        console.error('❌ [ElevenLabs Webhook] Error creating fallback call:', insertError)
      } else {
        console.log('✅ [ElevenLabs Webhook] Fallback call created successfully')
      }
    }
    
  } catch (error) {
    console.error('💥 [ElevenLabs Webhook] Error processing webhook data:', error)
  }
}
