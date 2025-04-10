import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LoggerService } from 'src/common/logger.service';
import { unlink } from 'fs/promises';

import { CreateMotorbikeDto } from './dto/create-motorbike.dto';
import { UpdateMotorbikeDto } from './dto/update-motorbike.dto';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class MotorbikesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: LoggerService,
  ) {}

  // ฟังก์ชันสำหรับจัดการการอัปโหลดไฟล์และตรวจสอบประเภทไฟล์
  handleFileUpload(file: Express.Multer.File): {
    message: string;
    filePath: string;
  } {
    if (!file) {
      throw new BadRequestException('no file uploaded');
    }

    // validate file type
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('invalid file type');
    }

    // validate file size (e.g., max 5mb)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException('file is too large!');
    }

    return { message: 'File uploaded successfully', filePath: file.path };
  }

  // ฟังก์ชันการสร้างมอเตอร์ไซค์ใหม่
  async create(
    createMotorbikeDto: CreateMotorbikeDto,
    file?: Express.Multer.File,
  ) {
    try {
      let imageUrl: string | undefined;
      if (file) {
        imageUrl = this.handleFileUpload(file).filePath;
      }

      const motorbike = await this.prisma.motorbikes.create({
        data: {
          name: createMotorbikeDto.name,
          price: createMotorbikeDto.price,
          image: imageUrl, // เก็บ path ของภาพที่อัปโหลด
          brand: {
            connect: { id: createMotorbikeDto.brand_id },
          },
        },
        include: { brand: true },
      });

      this.logger.log(`Motorbike created: ${motorbike.id}`);

      return {
        brand: motorbike.brand,
        name: motorbike.name,
        price: motorbike.price,
        image: motorbike.image,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      this.logger.error(`Failed to create motorbike: ${errorMessage}`);
      throw new Error('Failed to create motorbike');
    }
  }

  async findAll() {
    try {
      const motorbikes = await this.prisma.motorbikes.findMany({
        include: { brand: true },
      });
      this.logger.log(`Fetched ${motorbikes.length} motorbikes`);
      return motorbikes;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      this.logger.error(`Failed to fetch motorbikes: ${errorMessage}`);
      throw new Error('Failed to fetch motorbikes');
    }
  }

  // ฟังก์ชันดึงข้อมูลมอเตอร์ไซค์ที่มี id
  async findOne(id: number) {
    try {
      const motorbike = await this.prisma.motorbikes.findUnique({
        where: { id },
        include: { brand: true },
      });
      if (!motorbike) {
        throw new NotFoundException(`Motorbike with ID ${id} not found`);
      }
      this.logger.log(`Fetched motorbike: ${id}`);
      return motorbike;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      this.logger.error(`Failed to fetch motorbike: ${errorMessage}`);
      throw error;
    }
  }

  async update(
    id: number,
    updateMotorbikeDto: UpdateMotorbikeDto,
    file?: Express.Multer.File,
  ) {
    try {
      this.logger.log(
        `Updating motorbike ${id} with data: ${JSON.stringify(updateMotorbikeDto)}`,
      );
      this.logger.log(`File uploaded: ${file ? file.path : 'No file'}`);

      const motorbike = await this.findOne(id);

      let imageUrl = motorbike.image;
      if (file) {
        if (imageUrl) {
          await this.deleteImage(imageUrl);
        }
        imageUrl = this.handleFileUpload(file).filePath;
      }

      const updatedMotorbike = await this.prisma.motorbikes.update({
        where: { id },
        data: {
          name: updateMotorbikeDto.name ?? motorbike.name,
          price: updateMotorbikeDto.price ?? motorbike.price,
          image: imageUrl,
          brand: updateMotorbikeDto.brand_id
            ? { connect: { id: updateMotorbikeDto.brand_id } }
            : undefined,
        },
        include: { brand: true },
      });

      this.logger.log(`Motorbike updated: ${id}`);
      return updatedMotorbike;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      this.logger.error(`Failed to update motorbike: ${errorMessage}`);
      throw error;
    }
  }
  // ฟังก์ชันลบมอเตอร์ไซค์
  async remove(id: number) {
    try {
      const motorbike = await this.findOne(id);

      if (motorbike.image) {
        await this.deleteImage(motorbike.image); // ลบไฟล์ที่เกี่ยวข้อง
      }

      await this.prisma.motorbikes.delete({
        where: { id },
      });
      this.logger.log(`Motorbike deleted: ${id}`);
      return { message: `Motorbike with ID ${id} deleted successfully` };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      this.logger.error(`Failed to delete motorbike: ${errorMessage}`);
      throw error;
    }
  }

  // ฟังก์ชันลบไฟล์ภาพ
  private async deleteImage(imagePath: string): Promise<void> {
    try {
      await unlink(imagePath); // ลบไฟล์ภาพ
      this.logger.log(`Deleted image: ${imagePath}`);
    } catch {
      this.logger.error(`Failed to delete image: ${imagePath}`);
    }
  }
}
