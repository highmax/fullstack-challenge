'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { postsService } from '@/services/posts.service';

export default function NewPostPage() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [authorUserId, setAuthorUserId] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const router = useRouter();

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (title.length < 3) newErrors.title = 'Title must be at least 3 characters';
    if (body.length < 10) newErrors.body = 'Body must be at least 10 characters';
    if (!authorUserId || parseInt(authorUserId) < 1)
      newErrors.authorUserId = 'Author user ID is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    if (!validate) return;
    setIsLoading(true);

    try {
      await postsService.create({
        title,
        body,
        authorUserId: Number(authorUserId),
      });
      router.push('/posts');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to create post';
      setApiError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Create Post</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter post title"
          error={errors.title}
        />

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Body</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write your post content..."
            rows={6}
            className={`px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y ${
              errors.body ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.body && <span className="text-sm text-red-500">{errors.body}</span>}
        </div>

        <Input
          label="Author User ID"
          type="number"
          value={authorUserId}
          onChange={(e) => setAuthorUserId(e.target.value)}
          placeholder="e.g. 1"
          error={errors.authorUserId}
        />

        {apiError && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">{apiError}</div>
        )}

        <div className="flex gap-3 mt-2">
          <Button type="submit" isLoading={isLoading}>
            Create Post
          </Button>
          <Button type="button" variant="secondary" onClick={() => router.push('/posts')}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
