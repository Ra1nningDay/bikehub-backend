import { Test, TestingModule } from '@nestjs/testing';
import { RoleController } from './role.controller';
import { LoggerService } from '../../common/logger.service';
import { RoleService } from './role.service';
import { PrismaService } from '../prisma/prisma.service';

describe('RoleController', () => {
  let controller: RoleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoleController],
      providers: [RoleService, PrismaService, LoggerService],
    }).compile();

    controller = module.get<RoleController>(RoleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
