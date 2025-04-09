import { Module } from '@nestjs/common';
import { MotorbikesController } from './motorbike.controller';
import { MotorbikesService } from './motorbike.service';
import { LoggerService } from 'src/common/logger.service';
import { PrismaService } from '../prisma/prisma.service';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const filename = `${Date.now()}-${file.originalname}`;
          cb(null, filename);
        },
      }),
    }),
  ],
  controllers: [MotorbikesController],
  providers: [MotorbikesService, PrismaService, LoggerService],
})
export class MotorbikeModule {}
