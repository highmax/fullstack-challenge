'use client';

import Link from 'next/link';
import { useAuth } from '@/context/auth-context';

export default function HomePage() {
  const { email } = useAuth();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h1>
      <p className="text-gray-500 mb-8">Welcome, {email}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/users"
          className="bg-white p-6 rounded-xl border border-gray-200 hover:border-blue-300 transition-colors"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Users</h2>
          <p className="text-sm text-gray-500">Browse users from ReqRes and save them locally</p>
        </Link>

        <Link
          href="/posts"
          className="bg-white p-6 rounded-xl border border-gray-200 hover:border-blue-300 transition-colors"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Posts</h2>
          <p className="text-sm text-gray-500">Create, read, update, and delete posts</p>
        </Link>
      </div>
    </div>
  );
}
