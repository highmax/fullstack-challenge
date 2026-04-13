'use client';

import { useState, useEffect } from 'react';
import { usersService } from '@/services/users.service';
import { User } from '@/types';
import Loading from '@/components/ui/Loading';
import EmptyState from '@/components/ui/EmptyState';
import Button from '@/components/ui/Button';
import Image from 'next/image';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [error, setError] = useState('');

  const fetchUsers = async (pageNum: number) => {
    setIsLoading(true);
    setError('');
    try {
      const data = await usersService.getReqresUsers(pageNum);
      setUsers(data.data);
      setTotalPages(data.total_pages || 1);
    } catch {
      setError('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  const handleImport = async (userId: number) => {
    setSavingId(userId);
    try {
      await usersService.importUser(userId);
      // Refresh to update isSavedLocally status
      await fetchUsers(page);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to save user';
      setError(typeof message === 'string' ? message : message[0]);
    } finally {
      setSavingId(null);
    }
  };

  const filteredUsers = users.filter((user) => {
    const term = search.toLowerCase();
    return (
      user.first_name.toLowerCase().includes(term) ||
      user.last_name.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term)
    );
  });

  if (isLoading) return <Loading message="Loading users..." />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Users</h1>

      <input
        type="text"
        placeholder="Search by name or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6"
      />

      {error && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">{error}</div>
      )}

      {filteredUsers.length === 0 ? (
        <EmptyState
          title="No users found"
          description={search ? 'Try a different search term' : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="bg-white p-4 rounded-xl border border-gray-200 flex items-center gap-4"
            >
              <Image
                src={user.avatar}
                alt={`${user.first_name} ${user.last_name}`}
                className="w-12 h-12 rounded-full"
                width={20}
                height={20}
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">
                  {user.first_name} {user.last_name}
                </p>
                <p className="text-sm text-gray-500 truncate">{user.email}</p>
              </div>
              {user.isSavedLocally ? (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full whitespace-nowrap">
                  Saved
                </span>
              ) : (
                <Button
                  variant="secondary"
                  onClick={() => handleImport(user.id)}
                  isLoading={savingId === user.id}
                  className="text-sm px-3 py-1"
                >
                  Save
                </Button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-center gap-4 mt-8">
        <Button
          variant="secondary"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Previous
        </Button>
        <span className="text-sm text-gray-500">
          Page {page} of {totalPages}
        </span>
        <Button
          variant="secondary"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
