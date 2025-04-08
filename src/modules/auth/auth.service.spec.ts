import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { LoggerService } from '../../common/logger.service';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let authService: AuthService;

  const mockPrismaService = {
    users: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      findFirst: jest.fn(),
    },
    roles: {
      findFirst: jest.fn(),
    },
  };

  const mockJwtService = {
    signAsync: jest.fn(),
    verifyAsync: jest.fn(),
  };

  const mockLoggerService = {
    log: jest.fn(),
    error: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: LoggerService, useValue: mockLoggerService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user and return tokens', async () => {
      const registerDto: RegisterDto = {
        name: 'test user',
        email: 'test@example.com',
        password: 'password123',
      };

      const mockRole = { id: 1, title: 'user' };
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        username: 'test user',
        user_roles: [{ role: mockRole }],
      };

      mockPrismaService.users.findUnique.mockResolvedValue(null); // No existing user
      mockPrismaService.roles.findFirst.mockResolvedValue(mockRole);
      mockPrismaService.users.create.mockResolvedValue(mockUser);
      mockJwtService.signAsync.mockResolvedValue('access_token');
      mockJwtService.signAsync.mockResolvedValue('refresh_token');

      const result = await authService.register(registerDto);

      expect(result.access_token).toBeDefined();
      expect(result.refresh_token).toBeDefined();
      expect(result.expires_in).toEqual(3600);
    });

    it('should throw error if email already exists', async () => {
      const registerDto: RegisterDto = {
        name: 'test user',
        email: 'test@example.com',
        password: 'password123',
      };

      mockPrismaService.users.findUnique.mockResolvedValue({} as any); // Simulate existing user

      await expect(authService.register(registerDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw error if role is not found', async () => {
      const registerDto: RegisterDto = {
        name: 'test user',
        email: 'test@example.com',
        password: 'password123',
      };

      mockPrismaService.users.findUnique.mockResolvedValue(null); // No existing user
      mockPrismaService.roles.findFirst.mockResolvedValue(null); // No role found

      await expect(authService.register(registerDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('login', () => {
    it('should return tokens when login is successful', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: await bcrypt.hash('password123', 10),
        user_roles: [{ role: { title: 'user' } }],
      };

      mockPrismaService.users.findUnique.mockResolvedValue(mockUser);
      mockJwtService.signAsync.mockResolvedValue('access_token');
      mockJwtService.signAsync.mockResolvedValue('refresh_token');

      const result = await authService.login(loginDto);

      expect(result.access_token).toBeDefined();
      expect(result.refresh_token).toBeDefined();
      expect(result.expires_in).toEqual(3600);
    });

    it('should throw UnauthorizedException if user not found', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      mockPrismaService.users.findUnique.mockResolvedValue(null);

      await expect(authService.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: await bcrypt.hash('password123', 10),
        user_roles: [{ role: { title: 'user' } }],
      };

      mockPrismaService.users.findUnique.mockResolvedValue(mockUser);

      await expect(authService.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('refreshToken', () => {
    it('should return a new access token when refresh token is valid', async () => {
      const refreshToken = 'valid_refresh_token';
      const mockPayload = {
        sub: 1,
        email: 'test@example.com',
        roles: ['user'],
      };
      mockJwtService.verifyAsync.mockResolvedValue(mockPayload);
      mockJwtService.signAsync.mockResolvedValue('new_access_token');

      const result = await authService.refreshToken(refreshToken);

      expect(result.access_token).toEqual('new_access_token');
      expect(result.expires_in).toEqual(3600);
    });

    it('should throw UnauthorizedException if refresh token is invalid', async () => {
      const refreshToken = 'invalid_refresh_token';
      mockJwtService.verifyAsync.mockRejectedValue(new Error());

      await expect(authService.refreshToken(refreshToken)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
