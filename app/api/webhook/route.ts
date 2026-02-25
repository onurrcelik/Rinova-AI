import { NextRequest, NextResponse } from 'next/server';
import { stripe, getWebhookSecret } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';

// Force dynamic rendering — this route reads raw request body and Stripe env vars at runtime
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
        return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
    }

    let event;

    try {
        event = stripe.webhooks.constructEvent(body, signature, getWebhookSecret());
    } catch (err) {
        console.error('Webhook signature verification failed:', err);
        return NextResponse.json(
            { error: 'Webhook signature verification failed' },
            { status: 400 }
        );
    }

    const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object;
                const userId = session.metadata?.userId;

                if (userId) {
                    console.log(`Upgrading user ${userId} to paid role`);
                    const { error } = await supabaseAdmin
                        .from('clients-real-estate')
                        .update({ role: 'paid' })
                        .eq('id', userId);

                    if (error) {
                        console.error('Failed to upgrade user role:', error);
                    }
                } else {
                    console.warn('No userId found in checkout session metadata');
                }
                break;
            }

            case 'customer.subscription.deleted': {
                const subscription = event.data.object;
                const customerId = subscription.customer as string;

                // Look up the user by finding the checkout session that created this subscription
                const sessions = await stripe.checkout.sessions.list({
                    subscription: subscription.id,
                    limit: 1,
                });

                const userId = sessions.data[0]?.metadata?.userId;

                if (userId) {
                    console.log(`Downgrading user ${userId} to general role (subscription canceled)`);
                    const { error } = await supabaseAdmin
                        .from('clients-real-estate')
                        .update({ role: 'general' })
                        .eq('id', userId);

                    if (error) {
                        console.error('Failed to downgrade user role:', error);
                    }
                } else {
                    console.warn(`No userId found for canceled subscription ${subscription.id}, customer ${customerId}`);
                }
                break;
            }

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }
    } catch (error) {
        console.error('Webhook handler error:', error);
        return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
    }

    return NextResponse.json({ received: true });
}
