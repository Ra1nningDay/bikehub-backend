import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { LoggerService } from 'src/common/logger.service';
import { PrismaService } from '../prisma/prisma.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const mockPrisma = {
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

    const mockLogger = {
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: LoggerService, useValue: mockLogger },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
