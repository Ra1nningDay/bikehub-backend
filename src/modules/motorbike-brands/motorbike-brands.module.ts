import { Module } from '@nestjs/common';
import { MotorbikeBrandsController } from './motorbike-brands.controller';
import { MotorbikeBrandsService } from './motorbike-brands.service';

@Module({
  controllers: [MotorbikeBrandsController],
  providers: [MotorbikeBrandsService],
})
export class MotorbikeBrandsModule {}
