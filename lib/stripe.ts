import Stripe from 'stripe';

const stripeApiKey = process.env.RACK_ENV === 'production'
    ? process.env.STRIPE_API_KEY!
    : process.env.STRIPE_DEV_API_KEY!;

export const stripe = new Stripe(stripeApiKey, {
    apiVersion: '2026-01-28.clover',
    typescript: true,
});

export const getWebhookSecret = () => {
    return process.env.RACK_ENV === 'production'
        ? process.env.STRIPE_PROD_WEBHOOK_SECRET!
        : process.env.STRIPE_WEBHOOK_SECRET!;
};
