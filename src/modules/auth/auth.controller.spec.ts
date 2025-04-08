import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { Jwt } from 'custom-types'; // Custom types you are using
import { PrismaService } from '../prisma/prisma.service'; // Assuming PrismaService is a wrapper for Prisma client

// Mock the dependencies
const mockAuthService = {
  register: jest.fn(),
  login: jest.fn(),
  getUserById: jest.fn(),
  insertUser: jest.fn(),
};

const mockConfigService = {
  get: jest.fn().mockReturnValue('http://localhost:3000'), // Mock frontend URL
};

const mockPrismaService = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
};

describe('AuthController', () => {
  let authController: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('register', () => {
    it('should call authService.register with registerDto', async () => {
      const registerDto = {
        name: 'test',
        email: 'test@example.com',
        password: 'password',
      };
      mockAuthService.register.mockResolvedValue({});

      await expect(authController.register(registerDto)).resolves.not.toThrow();
      expect(mockAuthService.register).toHaveBeenCalledWith(registerDto);
    });
  });

  describe('login', () => {
    it('should call authService.login with loginDto and return an access token', async () => {
      const loginDto = { email: 'test@example.com', password: 'password' };
      mockAuthService.login.mockResolvedValue({ accessToken: 'jwt-token' });

      await expect(authController.login(loginDto)).resolves.toEqual({
        accessToken: 'jwt-token',
      });
      expect(mockAuthService.login).toHaveBeenCalledWith(loginDto);
    });
  });

  describe('getProfile', () => {
    it('should call authService.getUserById and return user data', async () => {
      const req: Jwt = { user: { id: 1 } } as Jwt;
      mockAuthService.getUserById.mockResolvedValue({
        id: 1,
        email: 'test@example.com',
      });

      await expect(authController.getProfile(req)).resolves.toEqual({
        id: 1,
        email: 'test@example.com',
      });
      expect(mockAuthService.getUserById).toHaveBeenCalledWith(1);
    });
  });

  describe('googleAuthRedirect', () => {
    it('should call authService.insertUser and redirect to frontend URL', async () => {
      const mockReq = {
        user: {
          googleId: 'google-id',
          email: 'google@example.com',
          displayName: 'Google User',
          avatar: 'google-avatar',
        },
      };
      const mockRes = { redirect: jest.fn() };
      mockAuthService.insertUser.mockResolvedValue({});

      await authController.googleAuthRedirect(mockReq as any, mockRes as any);

      expect(mockAuthService.insertUser).toHaveBeenCalledWith(mockReq.user);
      expect(mockRes.redirect).toHaveBeenCalledWith(
        'http://localhost:3000/auth/callback?&user=' +
          encodeURIComponent(
            JSON.stringify({
              id: 'google-id',
              email: 'google@example.com',
              name: 'Google User',
              avatar: 'google-avatar',
            }),
          ) +
          '&token=' +
          encodeURIComponent('undefined'),
      );
    });

    it('should throw an error if no user from Google', async () => {
      const mockReq = { user: null };
      const mockRes = {};

      await expect(
        authController.googleAuthRedirect(mockReq as any, mockRes as any),
      ).rejects.toThrow('No user from Google');
    });
  });
});
