'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Post } from '@/types';
import { postsService } from '@/services/posts.service';
import Button from '@/components/ui/Button';
import Loading from '@/components/ui/Loading';

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await postsService.getById(id);
        setPost(data);
      } catch {
        setError('Post not found');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
      await postsService.delete(id);
      router.push('/posts');
    } catch {
      setError('Failed to delete post');
    }
  };

  if (isLoading) return <Loading message="Loading post..." />;

  if (error || !post) {
    return (
      <div className="text-center py-12">
        <h2 className="text-lg font-medium text-gray-500">{error || 'Post not found'}</h2>
        <Link href="/posts" className="text-blue-600 text-sm mt-4 inline-block">
          Back to posts
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <Link href="/posts" className="text-sm text-blue-600 hover:text-blue-700 mb-4 inline-block">
        ← Back to posts
      </Link>

      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{post.title}</h1>
        <p className="text-xs text-gray-400 mb-6">
          Author ID: {post.authorUserId} · Created: {new Date(post.createdAt).toLocaleDateString()}{' '}
          · Updated: {new Date(post.updatedAt).toLocaleDateString()}
        </p>
        <p className="text-gray-700 whitespace-pre-wrap">{post.body}</p>

        <div className="flex gap-3 mt-8 pt-6 border-t border-gray-100">
          <Link href={`/posts/${post._id}/edit`}>
            <Button variant="secondary">Edit</Button>
          </Link>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
