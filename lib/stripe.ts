import Stripe from 'stripe'
import { supabase } from './supabase'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export const createCheckoutSession = async (priceId: string, userId?: string) => {
  let customerId = undefined
  
  if (userId) {
    // Get or create Stripe customer for this user
    const { data: user } = await supabase
      .from('users')
      .select('stripe_customer_id, email')
      .eq('id', userId)
      .single()

    if (user?.stripe_customer_id) {
      customerId = user.stripe_customer_id
    } else if (user?.email) {
      // Create new Stripe customer
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          user_id: userId
        }
      })
      
      // Update user with Stripe customer ID
      await supabase
        .from('users')
        .update({ stripe_customer_id: customer.id })
        .eq('id', userId)
      
      customerId = customer.id
    }
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pricing?canceled=true`,
    customer: customerId,
    metadata: {
      user_id: userId
    }
  })

  return session
}

export const createCreditPurchaseSession = async (amount: number, userId?: string) => {
  let customerId = undefined
  
  if (userId) {
    // Get or create Stripe customer for this user
    const { data: user } = await supabase
      .from('users')
      .select('stripe_customer_id, email')
      .eq('id', userId)
      .single()

    if (user?.stripe_customer_id) {
      customerId = user.stripe_customer_id
    } else if (user?.email) {
      // Create new Stripe customer
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          user_id: userId
        }
      })
      
      // Update user with Stripe customer ID
      await supabase
        .from('users')
        .update({ stripe_customer_id: customer.id })
        .eq('id', userId)
      
      customerId = customer.id
    }
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${amount} Call Credits`,
            description: 'AI voice call credits for ProposalAI',
          },
          unit_amount: amount * 100, // Convert to cents
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pricing?canceled=true`,
    customer: customerId,
    metadata: {
      user_id: userId
    }
  })

  return session
}

