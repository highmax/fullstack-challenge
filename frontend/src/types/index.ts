export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
  isSavedLocally?: boolean;
  localId?: string | null;
}

export interface SavedUser {
  _id: string;
  reqresId: number;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string;
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  _id: string;
  title: string;
  body: string;
  authorUserId: number;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  per_page?: number;
  limit?: number;
  total: number;
  total_pages?: number;
  totalPages?: number;
}

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthData {
  token: string;
  email: string;
}
