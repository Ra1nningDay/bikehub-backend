import { Test, TestingModule } from '@nestjs/testing';
import { RoleService } from './role.service';
import { PrismaService } from '../prisma/prisma.service';
import { LoggerService } from '../../common/logger.service';

describe('RoleService', () => {
  let service: RoleService;

  beforeEach(async () => {
    const mockPrisma = {
      findMany: jest.fn(),
      findUniqe: jest.fn(),
      create: jest.fn(),
    };

    const mockLogger = {
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoleService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: LoggerService, useValue: mockLogger },
      ],
    }).compile();

    service = module.get<RoleService>(RoleService);
  });

  it('should return when request all role', () => {
    expect(service).toBeDefined();
  });
});
