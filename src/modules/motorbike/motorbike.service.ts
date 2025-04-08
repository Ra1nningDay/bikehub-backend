import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMotorbikeDto } from './dto/create-motorbike.dto';
import { UpdateMotorbikeDto } from './dto/update-motorbike.dto';

@Injectable()
export class MotorbikesService {
  constructor(private prisma: PrismaService) {}

  // Create
  async create(createMotorbikeDto: CreateMotorbikeDto) {
    return this.prisma.motorbikes.create({
      data: {
        name: createMotorbikeDto.name,
        price: createMotorbikeDto.price,
        brand: {
          connect: { id: createMotorbikeDto.brand_id },
        },
      },
    });
  }

  // Read (All)
  async findAll() {
    return this.prisma.motorbikes.findMany({
      include: { brand: true }, // รวมข้อมูลยี่ห้อ
    });
  }

  // Read (One)
  async findOne(id: number) {
    return this.prisma.motorbikes.findUnique({
      where: { id },
      include: { brand: true },
    });
  }

  // Update
  async update(id: number, updateMotorbikeDto: UpdateMotorbikeDto) {
    return this.prisma.motorbikes.update({
      where: { id },
      data: {
        name: updateMotorbikeDto.name,
        price: updateMotorbikeDto.price,
        brand: updateMotorbikeDto.brand_id
          ? { connect: { id: updateMotorbikeDto.brand_id } }
          : undefined,
      },
    });
  }

  // Delete
  async remove(id: number) {
    return this.prisma.motorbikes.delete({
      where: { id },
    });
  }
}
