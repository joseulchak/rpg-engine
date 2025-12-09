import {
  Controller,
  Post,
  Body,
  Request,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import type { loginDto } from './dtos/login.dto';
import { registerDto } from './dtos/register-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() body: registerDto) {
    return this.authService.register(body);
  }
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: loginDto) {
    const { email, password } = body;
    return this.authService.login({ email, password });
  }
}
