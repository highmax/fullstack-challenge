'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { postsService } from '@/services/posts.service';
import { Post } from '@/types';
import Loading from '@/components/ui/Loading';
import EmptyState from '@/components/ui/EmptyState';
import Button from '@/components/ui/Button';

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const fetchPosts = async (pageNum: number) => {
    setIsLoading(true);
    setError('');
    try {
      const data = await postsService.getAll(pageNum);
      setPosts(data.data);
      setTotalPages(data.totalPages || 1);
    } catch {
      setError('Failed to load posts');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(page);
  }, [page]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    setDeletingId(id);
    try {
      await postsService.delete(id);
      await fetchPosts(page);
    } catch {
      setError('Failed to delete post');
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) return <Loading message="Loading posts..." />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Posts</h1>
        <Link href="/posts/new">
          <Button>New Post</Button>
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">{error}</div>
      )}

      {posts.length === 0 ? (
        <EmptyState title="No posts yet" description="Create your first post to get started" />
      ) : (
        <div className="flex flex-col gap-4">
          {posts.map((post) => (
            <div key={post._id} className="bg-white p-5 rounded-xl border border-gray-200">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/posts/${post._id}`}
                    className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                  >
                    {post.title}
                  </Link>
                  <p className="text-gray-500 text-sm mt-1 line-clamp-2">{post.body}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    Author ID: {post.authorUserId} · {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Link href={`/posts/${post._id}/edit`}>
                    <Button variant="secondary" className="text-sm px-3 py-1">
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="danger"
                    className="text-sm px-3 py-1"
                    onClick={() => handleDelete(post._id)}
                    isLoading={deletingId === post._id}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
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
      )}
    </div>
  );
}
