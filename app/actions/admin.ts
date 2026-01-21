'use server';

import { createClient } from '@supabase/supabase-js';
import { auth } from '@/lib/auth/auth';
import { redirect } from 'next/navigation';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'admin') {
    throw new Error('Unauthorized');
  }
}

export async function getAdminStats() {
  await checkAdmin();

  // Get users count
  const { count: usersCount, error: usersError } = await supabaseAdmin
    .from('clients-real-estate')
    .select('*', { count: 'exact', head: true });

  if (usersError) throw usersError;

  // Get total generations count
  // We can sum the generation_count column from clients or count the generations table
  // Let's count the generations table for accuracy if it tracks all generations
  const { count: generationsCount, error: generationsError } = await supabaseAdmin
    .from('real-estate-generations')
    .select('*', { count: 'exact', head: true });

  if (generationsError) throw generationsError;

  // Get active users (active in last 7 days - assuming we have a created_at or updated_at on generations)
  // For now let's just return total users as active users metric might require more complex query

  return {
    totalUsers: usersCount || 0,
    totalGenerations: generationsCount || 0,
  };
}

export async function getUsers() {
  await checkAdmin();

  const { data: users, error } = await supabaseAdmin
    .from('clients-real-estate')
    .select('*') // This will now include subscription_renewal_day if the column exists
    .order('created_at', { ascending: false });

  if (error) throw error;

  // Fetch 24h generation count for each user
  const oneDayAgo = new Date();
  oneDayAgo.setHours(oneDayAgo.getHours() - 24);

  // We do this in a separate query to get counts efficiently
  // Alternatively we could use a join if we had a view, but simple query is fine
  const { data: recentGenerations, error: genError } = await supabaseAdmin
    .from('real-estate-generations')
    .select('user')
    .gte('created_at', oneDayAgo.toISOString());

  if (genError) throw genError;

  // Map counts
  const recentCounts: Record<string, number> = {};
  recentGenerations?.forEach((gen: any) => {
    if (gen.user) {
        recentCounts[gen.user] = (recentCounts[gen.user] || 0) + 1;
    }
  });

  return users.map((user: any) => ({
    ...user,
    last_24h_count: recentCounts[user.id] || 0
  }));
}

export async function getRecentGenerations(limit = 50) {
  await checkAdmin();

  const { data: generations, error } = await supabaseAdmin
    .from('real-estate-generations')
    .select('*, user_data:clients-real-estate(email)')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;

  // Flatten the response
  return generations.map((gen: any) => ({
    ...gen,
    user_email: gen.user_data?.email || 'Unknown'
  }));
}

export async function updateUserRole(userId: string, role: string) {
  await checkAdmin();

  const { error } = await supabaseAdmin
    .from('clients-real-estate')
    .update({ role })
    .eq('id', userId);

  if (error) throw error;
  return { success: true };
}

export async function resetGenerationCount(userId: string) {
  await checkAdmin();

  const { error } = await supabaseAdmin
    .from('clients-real-estate')
    .update({ generation_count: 0 })
    .eq('id', userId);

  if (error) throw error;
  return { success: true };
}

export async function updateSubscriptionRenewalDay(userId: string, day: number) {
  await checkAdmin();

  if (day < 1 || day > 31) {
    throw new Error('Day must be between 1 and 31');
  }

  const { error } = await supabaseAdmin
    .from('clients-real-estate')
    .update({ subscription_renewal_day: day })
    .eq('id', userId);

  if (error) throw error;
  return { success: true };
}

export async function getGenerationStats() {
  await checkAdmin();

  // Get generations for the last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { data: generations, error } = await supabaseAdmin
    .from('real-estate-generations')
    .select('created_at, style, room_type')
    .gte('created_at', thirtyDaysAgo.toISOString());

  if (error) throw error;

  return generations;
}
