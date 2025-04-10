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
import { Request, Response } from 'express';
import { GoogleUser, Jwt } from 'custom-types';

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
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const { access_token, refresh_token, expires_in } =
      await this.authService.login(loginDto);

    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: expires_in * 1000, // 1 hour in milliseconds
    });

    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    });

    return res.json({ access_token, expires_in });
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  async getProfile(@Req() req: Jwt) {
    return this.authService.getUserById(+req.user.id);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth() {}

  // Google Callback URL
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    if (!req.user) {
      throw new Error('No user from Google');
    }

    const { accessToken, ...rest }: GoogleUser = req.user as GoogleUser;

    const user = await this.authService.insertUser(rest);
    const encodedUserData: string = encodeURIComponent(
      JSON.stringify({
        id: user.id,
        email: rest.email,
        name: rest.displayName,
        avatar: rest.avatar,
      }),
    );

    const encodedToken: string = encodeURIComponent(accessToken);
    const frontendUrl: string | undefined =
      this.configService.get<string>('URL_FRONTEND');

    if (!frontendUrl) {
      throw new Error('URL_FRONTEND is not defined');
    }

    res.redirect(
      `${frontendUrl}/auth/callback?&user=${encodedUserData}&token=${encodedToken}`,
    );
  }
}
