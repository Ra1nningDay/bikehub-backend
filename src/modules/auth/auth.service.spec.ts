import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from './auth.service';
import { LoggerService } from '../../common/logger.service';
import { JwtModule } from '@nestjs/jwt';

describe('AuthService', () => {
  let service: AuthService;

  const prismaMock = {
    users: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
    roles: {
      findFirst: jest.fn(),
    },
    user_roles: {
      findMany: jest.fn(),
    },
  };

  const loggerMock = {
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'test-secret',
          signOptions: { expiresIn: '1h' },
        }),
      ],
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: LoggerService, useValue: loggerMock },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should return user by id', async () => {
    const mockUser = {
      id: 1, // เพิ่ม id
      username: 'test',
      email: 'test@test.com',
      password: '123456',
      avatar: null, // เพิ่ม avatar
      user_roles: [{ role: { title: 'user' } }],
    };

    prismaMock.users.create.mockResolvedValue(mockUser);
    const mockRole = { id: 1, title: 'user' };
    prismaMock.roles.findFirst.mockResolvedValue(mockRole);
    prismaMock.user_roles.findMany.mockResolvedValue(mockUser.user_roles);

    const result = await service.register({
      name: 'test',
      email: 'test@test.com',
      password: '123456',
    });

    expect(result).toEqual({
      user: {
        id: mockUser.id,
        name: mockUser.username,
        email: mockUser.email,
        avatar: mockUser.avatar,
        roles: mockUser.user_roles.map((ur) => ur.role.title),
      },
      token: expect.any(String),
    });
  });
});
