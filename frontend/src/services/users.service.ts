import api from './api';
import { User, SavedUser, PaginatedResponse, ApiResponse } from '@/types';

export const usersService = {
  async getReqresUsers(page: number = 1): Promise<PaginatedResponse<User>> {
    const { data } = await api.get<ApiResponse<PaginatedResponse<User>>>(
      `/users/reqres?page=${page}`,
    );
    return data.data;
  },

  async getReqresUser(id: number): Promise<User> {
    const { data } = await api.get<ApiResponse<User>>(`/users/reqres/${id}`);
    return data.data;
  },

  async importUser(id: number): Promise<SavedUser> {
    const { data } = await api.post<ApiResponse<SavedUser>>(`/users/import/${id}`);
    return data.data;
  },

  async getSavedUsers(): Promise<SavedUser[]> {
    const { data } = await api.get<ApiResponse<SavedUser[]>>('/users/saved');
    return data.data;
  },

  async deleteSavedUser(id: string): Promise<void> {
    await api.delete(`/users/saved/${id}`);
  },
};
