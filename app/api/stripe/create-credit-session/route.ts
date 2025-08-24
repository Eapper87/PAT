import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { amount, userId } = await req.json()

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Valid amount is required' }, { status: 400 })
    }

    let customerId: string | undefined = undefined
    
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

    const sessionParams: any = {
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
      metadata: {
        user_id: userId
      }
    }

    if (customerId) {
      sessionParams.customer = customerId
    }

    const session = await stripe.checkout.sessions.create(sessionParams)

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error('Error creating credit purchase session:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create credit purchase session' },
      { status: 500 }
    )
  }
}
