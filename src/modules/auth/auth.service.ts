// src/auth/auth.service.ts
import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoggerService } from 'src/common/logger.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private logger: LoggerService,
  ) {}

  async register(
    registerDto: RegisterDto,
  ): Promise<{ user: any; token: string }> {
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

    const payload = { sub: user.id, email: user.email };
    const access_token = await this.jwtService.signAsync(payload);

    this.logger.log(`User registered successfully: ${email}`);
    return {
      user: {
        id: user.id,
        name: user.username,
        email: user.email,
        avatar: user.avatar,
        roles: user.user_roles.map((ur) => ur.role.title),
      },
      token: access_token,
    };
  }

  async login(loginDto: LoginDto): Promise<{ user: any; token: string }> {
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

    const payload = { sub: user.id, email: user.email };
    const access_token = await this.jwtService.signAsync(payload);

    this.logger.log(`User logged in successfully: ${email}`);
    return {
      user: {
        id: user.id,
        name: user.username,
        email: user.email,
        avatar: user.avatar,
        roles: user.user_roles.map((ur) => ur.role.title),
      },
      token: access_token,
    };
  }
}
