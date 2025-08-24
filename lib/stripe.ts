import Stripe from 'stripe'

// Server-side Stripe instance - only use in API routes
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

// Note: Stripe operations are now handled via API routes:
// - /api/stripe/create-checkout - for subscriptions
// - /api/stripe/create-credit-session - for credit purchases
// - /api/stripe/webhook - for webhook handling

