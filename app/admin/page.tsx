import {
  getAdminStats,
  getUsers,
  getRecentGenerations,
  getGenerationStats,
} from '@/app/actions/admin';
import AdminDashboardClient from './client-page';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const [stats, users, generations, generationStats] = await Promise.all([
    getAdminStats(),
    getUsers(),
    getRecentGenerations(),
    getGenerationStats(),
  ]);

  return (
    <AdminDashboardClient
      stats={stats}
      users={users}
      generations={generations}
      generationStats={generationStats}
    />
  );
}
