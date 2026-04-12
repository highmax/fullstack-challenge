import { Injectable } from '@nestjs/common';
import { ReqresService } from '../reqres/reqres.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private readonly reqresService: ReqresService) {}

  async login(loginDto: LoginDto) {
    const { token } = await this.reqresService.login(loginDto.email, loginDto.password);

    return {
      token,
      email: loginDto.email,
    };
  }
}
