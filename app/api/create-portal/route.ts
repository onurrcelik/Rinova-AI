import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { stripe } from '@/lib/stripe';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session || !session.user || !session.user.id || !session.user.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const origin = req.headers.get('origin') || 'http://localhost:3000';

        // Find the Stripe customer by email
        const customers = await stripe.customers.list({
            email: session.user.email,
            limit: 1,
        });

        if (customers.data.length === 0) {
            return NextResponse.json({ error: 'No subscription found' }, { status: 404 });
        }

        const portalSession = await stripe.billingPortal.sessions.create({
            customer: customers.data[0].id,
            return_url: `${origin}/plans`,
        });

        return NextResponse.json({ url: portalSession.url });
    } catch (error) {
        console.error('Portal session error:', error);
        return NextResponse.json(
            { error: 'Failed to create portal session', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
