import { Module } from '@nestjs/common';
import { MotorbikeBrandsController } from './motorbike-brands.controller';
import { MotorbikeBrandsService } from './motorbike-brands.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [MotorbikeBrandsController],
  providers: [MotorbikeBrandsService, PrismaService],
})
export class MotorbikeBrandsModule {}
