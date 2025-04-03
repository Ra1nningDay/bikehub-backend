import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { LoggerService } from 'src/common/logger.service';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [UsersService, LoggerService],
})
export class UsersModule {}
