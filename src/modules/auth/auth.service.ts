import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoggerService } from '../../common/logger.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { GoogleUser, JwtPayLoad, User } from 'custom-types';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private logger: LoggerService,
  ) {}

  async register(registerDto: RegisterDto): Promise<{
    access_token: string;
    refresh_token: string;
    expires_in: number;
  }> {
    const { name, email, password } = registerDto;

    const existingUser = await this.prisma.users.findUnique({
      where: { email },
    });
    if (existingUser) {
      this.logger.error(`Registration failed: Email ${email} already exists`);
      throw new BadRequestException('Email already exists');
    }

    const saltRound = 10;
    const hash = await bcrypt.hash(password, saltRound);

    const role = await this.prisma.roles.findFirst({
      where: { title: 'user' },
    });
    if (!role) {
      this.logger.error('Registration failed: Role "user" not found');
      throw new BadRequestException('Role "user" not found');
    }

    const user = await this.prisma.users.create({
      data: {
        username: name,
        email,
        password: hash,
        avatar: 'default-avatar.png',
        oauth_id: '',
        oauth_provider: '',
        user_roles: {
          create: [
            {
              role: {
                connect: {
                  id: role.id,
                },
              },
            },
          ],
        },
      },
      include: {
        user_roles: {
          include: {
            role: true,
          },
        },
      },
    });

    const roles = user.user_roles.map((ur) => ur.role.title);
    const payload = { sub: user.id, email: user.email, roles };
    const access_token = await this.jwtService.signAsync(payload);
    const refresh_token = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
    });

    this.logger.log(`User registered successfully: ${email}`);
    return {
      access_token,
      refresh_token,
      expires_in: 3600,
    };
  }

  async login(loginDto: LoginDto): Promise<{
    access_token: string;
    refresh_token: string;
    expires_in: number;
  }> {
    const { email, password } = loginDto;

    const user = await this.prisma.users.findUnique({
      where: { email },
      include: {
        user_roles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!user) {
      this.logger.error(`Login failed: User with email ${email} not found`);
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      this.logger.error(`Login failed: Invalid password for email ${email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    const roles = user.user_roles.map((ur) => ur.role.title);
    const payload = { sub: user.id, email: user.email, roles };
    const access_token = await this.jwtService.signAsync(payload);
    const refresh_token = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
    });

    this.logger.log(`User logged in successfully: ${email}`);
    return {
      access_token,
      refresh_token,
      expires_in: 3600,
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload: JwtPayLoad =
        await this.jwtService.verifyAsync(refreshToken);
      const newPayload: JwtPayLoad = {
        sub: payload.sub,
        email: payload.email,
        roles: payload.roles,
      };
      const access_token = await this.jwtService.signAsync(newPayload, {
        expiresIn: '1h',
      });
      return { access_token, expires_in: 3600 };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async getUserById(id: number) {
    const user = await this.prisma.users.findUnique({
      where: { id: id },
      select: {
        id: true,
        username: true,
        email: true,
        user_roles: {
          include: {
            role: true,
          },
        },
      },
    });

    return {
      id: user?.id,
      email: user?.email,
      name: user?.username,
      roles: user?.user_roles.map((ur) => ur.role.title),
    };
  }

  async insertUser(user: any) {
    const { googleId, email, displayName, avatar }: GoogleUser =
      user as GoogleUser;

    const existingUser = await this.prisma.users.findFirst({
      where: { oauth_id: googleId },
    });

    const role = await this.prisma.roles.findFirst({
      where: { title: 'user' },
    });

    if (!role) {
      this.logger.error('Registration failed: Role "user" not found');
      throw new BadRequestException('Role "user" not found');
    }

    if (!existingUser) {
      await this.prisma.users.create({
        data: {
          email: email,
          password: '',
          oauth_id: googleId,
          oauth_provider: 'google',
          username: displayName,
          avatar: avatar,
          created_at: new Date(),
          updated_at: new Date(),
          user_roles: {
            create: [
              {
                role: {
                  connect: {
                    id: role.id,
                  },
                },
              },
            ],
          },
        },
        include: {
          user_roles: {
            include: {
              role: true,
            },
          },
        },
      });
    } else {
      await this.prisma.users.update({
        where: {
          id: existingUser.id,
        },
        data: {
          email,
          oauth_id: googleId,
          oauth_provider: 'google',
          username: displayName,
          avatar: avatar,
          updated_at: new Date(),
        },
      });
    }
  }

  generateJwt(user: User) {
    const payload = { email: user.email, sub: user.id };
    return this.jwtService.sign(payload, { secret: process.env.JWT_SECRET });
  }
}
