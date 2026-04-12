import api from './api';
import { AuthData, LoginCredentials } from '@/types';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthData> {
    const { data } = await api.post('/auth/login', credentials);
    return data.data;
  },
};
