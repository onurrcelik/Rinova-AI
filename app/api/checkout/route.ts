import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { stripe } from '@/lib/stripe';

function resolvePriceId(plan: string): string | null {
    const isProduction = process.env.RACK_ENV === 'production';

    if (plan === 'weekly') {
        // No test weekly price available — only works in production
        if (!isProduction) return null;
        return process.env.RINOVA_PRO_WEEKLY_PRICE_ID!;
    }

    if (plan === 'monthly') {
        return isProduction
            ? process.env.RINOVA_PRO_PRICE_ID!
            : process.env.RINOVA_PRO_TEST_PRICE_ID!;
    }

    return null;
}

export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { plan } = await req.json();

        if (!plan || !['weekly', 'monthly'].includes(plan)) {
            return NextResponse.json({ error: 'Invalid plan. Must be "weekly" or "monthly".' }, { status: 400 });
        }

        const priceId = resolvePriceId(plan);
        if (!priceId) {
            return NextResponse.json(
                { error: `The ${plan} plan is not available in test mode.` },
                { status: 400 }
            );
        }

        const origin = req.headers.get('origin') || 'http://localhost:3000';

        const checkoutSession = await stripe.checkout.sessions.create({
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            success_url: `${origin}/plans?success=true`,
            cancel_url: `${origin}/plans?canceled=true`,
            customer_email: session.user.email || undefined,
            metadata: {
                userId: session.user.id,
                userEmail: session.user.email || '',
            },
        });

        return NextResponse.json({ url: checkoutSession.url });
    } catch (error) {
        console.error('Checkout error:', error);
        return NextResponse.json(
            { error: 'Failed to create checkout session', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
