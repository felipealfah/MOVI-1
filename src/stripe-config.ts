// Stripe product configuration
export const STRIPE_PRODUCTS = {
  basic_100: {
    priceId: import.meta.env.VITE_STRIPE_PRICE_BASIC || 'price_1SBh9MA3Ey5GjayWnkwgOAQD',
    name: 'Basic Plan',
    description: '100 credits - $0.20 per minute',
    mode: 'payment' as const,
    credits: 100,
    pricePerMinute: 0.20,
    totalPrice: 20.00,
    category: 'basic'
  },
  premium_500: {
    priceId: import.meta.env.VITE_STRIPE_PRICE_PREMIUM || 'price_1SBhAmA3Ey5GjayWsBWfi0ty',
    name: 'Premium Plan',
    description: '500 credits - $0.15 per minute',
    mode: 'payment' as const,
    credits: 500,
    pricePerMinute: 0.15,
    totalPrice: 75.00,
    category: 'premium'
  },
  business_1000: {
    priceId: import.meta.env.VITE_STRIPE_PRICE_BUSINESS || 'price_1SBhBdA3Ey5GjayWBMmMqteL',
    name: 'Business Plan',
    description: '1000 credits - $0.15 per minute',
    mode: 'payment' as const,
    credits: 1000,
    pricePerMinute: 0.15,
    totalPrice: 150.00,
    category: 'premium'
  },
} as const;

export type StripeProductId = keyof typeof STRIPE_PRODUCTS;

// Helper function to get product by credits
export const getProductByCredits = (credits: number) => {
  return Object.values(STRIPE_PRODUCTS).find(product => product.credits === credits);
};

// Helper function to get price per minute based on credits
export const getPricePerMinute = (credits: number): number => {
  if (credits >= 500) {
    return 0.15; // Premium pricing for 500+ credits
  }
  return 0.20; // Basic pricing for 100 credits
};