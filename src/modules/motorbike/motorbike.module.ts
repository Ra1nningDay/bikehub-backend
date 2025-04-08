import { Module } from '@nestjs/common';
import { MotorbikeController } from './motorbike.controller';
import { MotorbikeService } from './motorbike.service';
import { LoggerService } from 'src/common/logger.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [MotorbikeController],
  providers: [MotorbikeService, PrismaService, LoggerService],
})
export class MotorbikeModule {}
