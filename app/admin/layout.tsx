import React from 'react';
import Link from 'next/link';
import { auth } from '@/lib/auth/auth';
import { redirect } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user || session.user.role !== 'admin') {
    redirect('/');
  }

  return (
    <div className="flex min-h-screen flex-col space-y-6">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex gap-6 md:gap-10">
            <Link href="/" className="flex items-center space-x-2">
              <span className="inline-block font-bold">Rinova Admin</span>
            </Link>
            <nav className="flex gap-6">
              <Link
                href="/admin"
                className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                Dashboard
              </Link>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
             <Link href="/">
                <Button variant="ghost" size="sm" className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back to App
                </Button>
             </Link>
             <div className="text-sm text-muted-foreground border-l pl-4 ml-2">
                {session.user.email}
             </div>
          </div>
        </div>
      </header>
      <div className="container grid flex-1 gap-12 md:grid-cols-[1fr]">
        <main className="flex w-full flex-1 flex-col overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
