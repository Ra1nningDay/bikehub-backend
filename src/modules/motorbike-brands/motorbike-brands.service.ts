import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMotorbikeBrandDto } from './dto/create-motorbike-brand.dto';
import { UpdateMotorbikeBrandDto } from './dto/update-motorbike-brand.dto';

@Injectable()
export class MotorbikeBrandsService {
  constructor(private prisma: PrismaService) {}

  async create(createMotorbikeBrandDto: CreateMotorbikeBrandDto) {
    return this.prisma.motorbike_brands.create({
      data: {
        name: createMotorbikeBrandDto.name,
        description: createMotorbikeBrandDto.description,
      },
    });
  }

  async findAll() {
    return this.prisma.motorbike_brands.findMany({
      include: { motorbikes: true }, // รวมข้อมูล motorbikes ที่เกี่ยวข้อง
    });
  }

  async findOne(id: number) {
    const brand = await this.prisma.motorbike_brands.findUnique({
      where: { id },
      include: { motorbikes: true },
    });
    if (!brand) {
      throw new NotFoundException(`Motorbike brand with ID ${id} not found`);
    }
    return brand;
  }

  async update(id: number, updateMotorbikeBrandDto: UpdateMotorbikeBrandDto) {
    await this.findOne(id);
    return this.prisma.motorbike_brands.update({
      where: { id },
      data: {
        name: updateMotorbikeBrandDto.name,
        description: updateMotorbikeBrandDto.description,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.motorbike_brands.delete({
      where: { id },
    });
  }
}
