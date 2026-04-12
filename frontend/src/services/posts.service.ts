import api from './api';
import { Post, PaginatedResponse, ApiResponse } from '@/types';

export interface CreatePostData {
  title: string;
  body: string;
  authorUserId: number;
}

export interface UpdatePostData {
  title?: string;
  body?: string;
}

export const postsService = {
  async getAll(page: number = 1, limit: number = 10): Promise<PaginatedResponse<Post>> {
    const { data } = await api.get<ApiResponse<PaginatedResponse<Post>>>(
      `/posts?page=${page}&limit=${limit}`,
    );
    return data.data;
  },

  async getById(id: string): Promise<Post> {
    const { data } = await api.get<ApiResponse<Post>>(`/posts/${id}`);
    return data.data;
  },

  async create(postData: CreatePostData): Promise<Post> {
    const { data } = await api.post<ApiResponse<Post>>('/posts', postData);
    return data.data;
  },

  async update(id: string, postData: UpdatePostData): Promise<Post> {
    const { data } = await api.put<ApiResponse<Post>>(`/posts/${id}`, postData);
    return data.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/posts/${id}`);
  },
};
