import { Module } from '@nestjs/common';
import { MotorbikesController } from './motorbike.controller';
import { MotorbikesService } from './motorbike.service';
import { LoggerService } from 'src/common/logger.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [MotorbikesController],
  providers: [MotorbikesService, PrismaService, LoggerService],
})
export class MotorbikeModule {}
