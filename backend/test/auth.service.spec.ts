import { Test, TestingModule } from '@nestjs/testing';
import { HttpException } from '@nestjs/common';
import { AuthService } from '../src/auth/auth.service';
import { ReqresService } from '../src/reqres/reqres.service';

describe('AuthService', () => {
  let authService: AuthService;
  let reqresService: Partial<ReqresService>;

  beforeEach(async () => {
    reqresService = {
      login: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, { provide: ReqresService, useValue: reqresService }],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should return token and email on successful login', async () => {
    (reqresService.login as jest.Mock).mockResolvedValue({
      token: 'QpwL5tke4Pnpja7X4',
    });

    const result = await authService.login({
      email: 'eve.holt@reqres.in',
      password: 'cityslicka',
    });

    expect(result).toEqual({
      token: 'QpwL5tke4Pnpja7X4',
      email: 'eve.holt@reqres.in',
    });
    expect(reqresService.login).toHaveBeenCalledWith('eve.holt@reqres.in', 'cityslicka');
  });

  it('should throw when ReqRes login fails', async () => {
    (reqresService.login as jest.Mock).mockRejectedValue(
      new HttpException('Missing password', 400),
    );

    await expect(authService.login({ email: 'test@test.com', password: '' })).rejects.toThrow(
      HttpException,
    );
  });
});
