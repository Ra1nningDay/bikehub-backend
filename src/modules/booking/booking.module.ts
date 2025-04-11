import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { PrismaService } from '../prisma/prisma.service';
import { LoggerService } from 'src/common/logger.service';

@Module({
  controllers: [BookingController],
  providers: [BookingService, PrismaService, LoggerService],
  exports: [BookingService],
})
export class BookingModule {}
