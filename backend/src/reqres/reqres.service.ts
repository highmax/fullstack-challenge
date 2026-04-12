import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

export interface ReqresUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

interface ReqresUserResponse {
  data: ReqresUser;
}

interface ReqresUsersListResponse {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: ReqresUser[];
}

interface ReqresLoginResponse {
  token: string;
}

@Injectable()
export class ReqresService {
  private readonly logger = new Logger(ReqresService.name);
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor(private readonly httpService: HttpService) {
    this.baseUrl = process.env.REQRES_BASE_URL || 'https://reqres.in/api';
    this.apiKey = process.env.REQRES_API_KEY || '';
  }

  private getHeaders() {
    return {
      'x-api-key': this.apiKey,
    };
  }

  async login(email: string, password: string): Promise<{ token: string }> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.post<ReqresLoginResponse>(
          `${this.baseUrl}/login`,
          { email, password },
          { headers: this.getHeaders() },
        ),
      );
      return { token: data.token };
    } catch (error: any) {
      const status = error.response?.status || HttpStatus.UNAUTHORIZED;
      const message =
        error.response?.data?.error || 'Invalid credentials';
      this.logger.warn(`Login failed: ${message}`);
      throw new HttpException(message, status);
    }
  }

  async getUsers(page: number = 1): Promise<ReqresUsersListResponse> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get<ReqresUsersListResponse>(
          `${this.baseUrl}/users?page=${page}`,
          { headers: this.getHeaders() },
        ),
      );
      return data;
    } catch (error: any) {
      this.logger.error(`Failed to fetch users: ${error.message}`);
      throw new HttpException(
        'Failed to fetch users from ReqRes',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  async getUserById(id: number): Promise<ReqresUser> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get<ReqresUserResponse>(
          `${this.baseUrl}/users/${id}`,
          { headers: this.getHeaders() },
        ),
      );
      return data.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new HttpException(
          `User with ID ${id} not found in ReqRes`,
          HttpStatus.NOT_FOUND,
        );
      }
      this.logger.error(`Failed to fetch user ${id}: ${error.message}`);
      throw new HttpException(
        'Failed to fetch user from ReqRes',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }
}