import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { auth } from '@/lib/auth/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
    const session = await auth();

    if (!session?.user || session.user.role !== 'admin') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error } = await supabase
        .from('app_error_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(200);

    if (error) {
        console.error('[admin/error-logs] Supabase error:', error);
        return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 });
    }

    return NextResponse.json({ logs: data });
}
