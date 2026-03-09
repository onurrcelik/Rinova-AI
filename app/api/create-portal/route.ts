import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { stripe } from '@/lib/stripe';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session || !session.user || !session.user.id || !session.user.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userEmail = session.user.email;

    try {
        const origin = req.headers.get('origin') || 'http://localhost:3000';

        // Find the Stripe customer by email
        console.log(`[create-portal] Looking up Stripe customer for: ${userEmail}`);
        const customers = await stripe.customers.list({
            email: userEmail,
            limit: 1,
        });

        console.log(`[create-portal] Found ${customers.data.length} customer(s) for ${userEmail}`);

        if (customers.data.length === 0) {
            console.error(`[create-portal] No Stripe customer found for email: ${userEmail}`);
            return NextResponse.json(
                { error: 'No subscription found for this account. Please subscribe first.' },
                { status: 404 }
            );
        }

        const customerId = customers.data[0].id;
        console.log(`[create-portal] Creating portal session for customer: ${customerId}`);

        const portalSession = await stripe.billingPortal.sessions.create({
            customer: customerId,
            return_url: `${origin}/plans`,
        });

        return NextResponse.json({ url: portalSession.url });
    } catch (error) {
        console.error('[create-portal] Portal session error:', error);
        return NextResponse.json(
            {
                error: 'Failed to create portal session',
                details: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}
