import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const {
            userId,
            userEmail,
            errorMessage,
            errorStack,
            pageUrl,
            componentStack,
            errorType = 'client',
        } = body;

        if (!errorMessage) {
            return NextResponse.json({ error: 'Missing errorMessage' }, { status: 400 });
        }

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        const { error } = await supabase.from('app_error_logs').insert({
            user_id: userId ?? null,
            user_email: userEmail ?? null,
            error_message: String(errorMessage).slice(0, 2000),
            error_stack: errorStack ? String(errorStack).slice(0, 5000) : null,
            page_url: pageUrl ?? null,
            component_stack: componentStack ? String(componentStack).slice(0, 5000) : null,
            error_type: errorType,
        });

        if (error) {
            console.error('[log-error] Supabase insert error:', error);
            return NextResponse.json({ error: 'Failed to log error' }, { status: 500 });
        }

        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error('[log-error] Unexpected error:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
