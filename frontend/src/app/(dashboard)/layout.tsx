'use client';

import AuthGuard from '@/components/auth-guard';
import Navbar from '@/components/navbar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>
    </AuthGuard>
  );
}
