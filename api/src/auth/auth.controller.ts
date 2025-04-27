import { Controller, Post, Body, Res, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './auth.dto';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { Public } from '@common/decorators/public.decorator';
import { AuthLoginSwagger, AuthRegisterSwagger } from './auth.swagger';

@ApiTags('auth')
@Controller('auth')
@Public()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @AuthRegisterSwagger()
  async register(@Body() dto: RegisterDto) {
    const emailCreated = await this.authService.register(dto);
    return {
      message:
        'Your account has been created successfully with email: ' +
        emailCreated,
    };
  }

  @Post('login')
  @HttpCode(200)
  @AuthLoginSwagger()
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const jwt = await this.authService.login(dto);
    res.cookie('jwt', jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production' ? true : false,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    });
    return { message: 'Login successful', jwt };
  }
}
