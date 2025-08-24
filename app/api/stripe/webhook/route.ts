import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { supabase } from '@/lib/supabase'
import { headers } from 'next/headers'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = headers().get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object
        
        if (session.mode === 'subscription') {
          // Handle subscription creation
          await handleSubscriptionCreated(session)
        } else {
          // Handle one-time payment for credits
          await handleCreditPurchase(session)
        }
        break

      case 'customer.subscription.updated':
        const subscription = event.data.object
        await handleSubscriptionUpdated(subscription)
        break

      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object
        await handleSubscriptionDeleted(deletedSubscription)
        break

      case 'invoice.payment_succeeded':
        const invoice = event.data.object
        await handleInvoicePaymentSucceeded(invoice)
        break

      case 'invoice.payment_failed':
        const failedInvoice = event.data.object
        await handleInvoicePaymentFailed(failedInvoice)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}

async function handleSubscriptionCreated(session: any) {
  const customerId = session.customer
  const subscriptionId = session.subscription
  const userId = session.metadata?.user_id

  if (!userId) {
    console.error('No user_id in session metadata')
    return
  }

  // Get subscription details
  const subscription = await stripe.subscriptions.retrieve(subscriptionId)
  const priceId = subscription.items.data[0].price.id

  // Determine credits based on price ID
  let credits = 0
  if (priceId === process.env.STRIPE_PRO_PRICE_ID) {
    credits = 75
  } else if (priceId === process.env.STRIPE_ENTERPRISE_PRICE_ID) {
    credits = 300
  }

  // Update user subscription status and credits
  // First get current credits, then update
  const { data: currentUser } = await supabase
    .from('users')
    .select('credits')
    .eq('id', userId)
    .single()

  if (currentUser) {
    await supabase
      .from('users')
      .update({
        subscription_status: 'active',
        credits: currentUser.credits + credits
      })
      .eq('id', userId)
  }

  // Create transaction record
  await supabase
    .from('transactions')
    .insert([
      {
        user_id: userId,
        stripe_id: subscriptionId,
        amount: credits,
        type: 'subscription',
        status: 'completed'
      }
    ])
}

async function handleCreditPurchase(session: any) {
  const userId = session.metadata?.user_id
  const amount = session.amount_total / 100 // Convert from cents

  if (!userId) {
    console.error('No user_id in session metadata')
    return
  }

  // Update user credits
  // First get current credits, then update
  const { data: currentUser } = await supabase
    .from('users')
    .select('credits')
    .eq('id', userId)
    .single()

  if (currentUser) {
    await supabase
      .from('users')
      .update({
        credits: currentUser.credits + amount
      })
      .eq('id', userId)
  }

  // Create transaction record
  await supabase
    .from('transactions')
    .insert([
      {
        user_id: userId,
        stripe_id: session.id,
        amount: amount,
        type: 'credits',
        status: 'completed'
      }
    ])
}

async function handleSubscriptionUpdated(subscription: any) {
  const customerId = subscription.customer
  const status = subscription.status

  // Find user by Stripe customer ID
  const { data: user } = await supabase
    .from('users')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single()

  if (user) {
    await supabase
      .from('users')
      .update({
        subscription_status: status === 'active' ? 'active' : 'inactive'
      })
      .eq('id', user.id)
  }
}

async function handleSubscriptionDeleted(subscription: any) {
  const customerId = subscription.customer

  // Find user by Stripe customer ID
  const { data: user } = await supabase
    .from('users')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single()

  if (user) {
    await supabase
      .from('users')
      .update({
        subscription_status: 'cancelled'
      })
      .eq('id', user.id)
  }
}

async function handleInvoicePaymentSucceeded(invoice: any) {
  const customerId = invoice.customer
  const subscriptionId = invoice.subscription

  if (subscriptionId) {
    // This is a subscription renewal
    const subscription = await stripe.subscriptions.retrieve(subscriptionId)
    const priceId = subscription.items.data[0].price.id

    // Determine credits based on price ID
    let credits = 0
    if (priceId === process.env.STRIPE_PRO_PRICE_ID) {
      credits = 75
    } else if (priceId === process.env.STRIPE_ENTERPRISE_PRICE_ID) {
      credits = 300
    }

    // Find user by Stripe customer ID
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('stripe_customer_id', customerId)
      .single()

    if (user) {
      // Add monthly credits
      // First get current credits, then update
      const { data: currentUser } = await supabase
        .from('users')
        .select('credits')
        .eq('id', user.id)
        .single()

      if (currentUser) {
        await supabase
          .from('users')
          .update({
            credits: currentUser.credits + credits
          })
          .eq('id', user.id)
      }

      // Create transaction record
      await supabase
        .from('transactions')
        .insert([
          {
            user_id: user.id,
            stripe_id: invoice.id,
            amount: credits,
            type: 'subscription',
            status: 'completed'
          }
        ])
    }
  }
}

async function handleInvoicePaymentFailed(invoice: any) {
  const customerId = invoice.customer

  // Find user by Stripe customer ID
  const { data: user } = await supabase
    .from('users')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single()

  if (user) {
    await supabase
      .from('users')
      .update({
        subscription_status: 'inactive'
      })
      .eq('id', user.id)
  }
}

