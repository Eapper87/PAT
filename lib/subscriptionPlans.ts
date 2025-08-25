// Future subscription plans configuration
// This will be used when implementing Stripe subscriptions

export interface SubscriptionPlan {
  id: string
  name: string
  price: number
  priceId: string // Stripe price ID
  minutesPerMonth: number
  features: string[]
  popular?: boolean
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free Tier',
    price: 0,
    priceId: '', // No Stripe price for free tier
    minutesPerMonth: 0, // Unlimited calls, 3 minutes max each
    features: [
      'Unlimited calls',
      '3 minutes maximum per call',
      'Basic AI receptionists',
      'Usage tracking'
    ]
  },
  {
    id: 'starter',
    name: 'Starter Plan',
    price: 29,
    priceId: 'price_starter_monthly', // Will be replaced with actual Stripe price ID
    minutesPerMonth: 300, // 5 hours
    features: [
      '300 minutes per month',
      'Extended call duration',
      'Priority support',
      'Advanced AI features'
    ]
  },
  {
    id: 'premium',
    name: 'Premium Plan',
    price: 99,
    priceId: 'price_premium_monthly', // Will be replaced with actual Stripe price ID
    minutesPerMonth: 1200, // 20 hours
    popular: true,
    features: [
      '1200 minutes per month',
      'Unlimited call duration',
      'Premium AI models',
      'Priority support',
      'Analytics dashboard'
    ]
  }
]

export const getPlanById = (id: string): SubscriptionPlan | undefined => {
  return SUBSCRIPTION_PLANS.find(plan => plan.id === id)
}

export const getFreePlan = (): SubscriptionPlan => {
  return SUBSCRIPTION_PLANS[0]
}
