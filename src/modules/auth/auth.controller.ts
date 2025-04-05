// src/auth/auth.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth() {}

  // Google Callback URL
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: any, @Res() res: any) {
    const user = req.user;
    const token = this.authService.generateJwt(user);

    await this.authService.insertUser(user);

    const userData = encodeURIComponent(JSON.stringify(user));
    const frontendUrl = this.configService.get<string>('URL_FRONTEND'); // อ่าน URL_FRONTEND

    if (!frontendUrl) {
      throw new Error('URL_FRONTEND is not defined');
    }
    res.redirect(
      `${frontendUrl}/auth/callback?token=${token}&user=${userData}`,
    );
  }
}
