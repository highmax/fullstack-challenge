'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/auth-context';

export default function Navbar() {
  const { email, logout } = useAuth();
  const pathname = usePathname();

  // This is for active link styles
  const linkStyles = (path: string) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      pathname.startsWith(path) ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
    }`;

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-1">
            <Link href="/" className="text-lg font-bold text-gray-900 mr-6">
              Portal
            </Link>
            <Link href="/users" className={linkStyles('/users')}>
              Users
            </Link>
            <Link href="/posts" className={linkStyles('/posts')}>
              Posts
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">{email}</span>
            <button
              onClick={logout}
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
