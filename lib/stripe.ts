import Stripe from 'stripe';

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
    if (!_stripe) {
        const stripeApiKey = process.env.RACK_ENV === 'production'
            ? process.env.STRIPE_API_KEY!
            : process.env.STRIPE_DEV_API_KEY!;

        _stripe = new Stripe(stripeApiKey, {
            apiVersion: '2026-01-28.clover',
            typescript: true,
        });
    }
    return _stripe;
}

// Keep backwards-compat alias used in existing routes
export const stripe = new Proxy({} as Stripe, {
    get(_target, prop) {
        return (getStripe() as unknown as Record<string | symbol, unknown>)[prop];
    },
});

export const getWebhookSecret = () => {
    return process.env.RACK_ENV === 'production'
        ? process.env.STRIPE_PROD_WEBHOOK_SECRET!
        : process.env.STRIPE_WEBHOOK_SECRET!;
};
