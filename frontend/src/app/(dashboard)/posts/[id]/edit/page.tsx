'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { postsService } from '@/services/posts.service';
import { Post } from '@/types';
import Loading from '@/components/ui/Loading';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function EditPostPage() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [apiError, setApiError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await postsService.getById(id);
        setPost(data);
        setTitle(data.title);
        setBody(data.body);
      } catch {
        setApiError('Post not found');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (title.length < 3) newErrors.title = 'Title must be at least 3 characters';
    if (body.length < 10) newErrors.body = 'Body must be at least 10 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSaving(true);
    setApiError('');
    try {
      await postsService.update(id, { title, body });
      router.push(`/posts/${id}`);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to update post';
      setApiError(typeof message === 'string' ? message : message[0]);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <Loading message="Loading post..." />;

  if (!post) {
    return (
      <div className="text-center py-12">
        <h2 className="text-lg font-medium text-gray-500">Post not found</h2>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Post</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={errors.title}
        />

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Body</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={6}
            className={`px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y ${
              errors.body ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.body && <span className="text-sm text-red-500">{errors.body}</span>}
        </div>

        <p className="text-sm text-gray-400">Author ID: {post.authorUserId}</p>

        {apiError && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">{apiError}</div>
        )}

        <div className="flex gap-3 mt-2">
          <Button type="submit" isLoading={isSaving}>
            Save Changes
          </Button>
          <Button type="button" variant="secondary" onClick={() => router.push(`/posts/${id}`)}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
