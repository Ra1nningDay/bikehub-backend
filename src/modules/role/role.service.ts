import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { roles } from '@prisma/client';
import { CreateRoleDto } from './dto/create-role.dto';

@Injectable()
export class RoleService {
  constructor(private prisma: PrismaService) {}
  async getAllRole(): Promise<roles[]> {
    return await this.prisma.roles.findMany();
  }

  async getById(id: number): Promise<roles | null> {
    return await this.prisma.roles.findUniqueOrThrow({ where: { id } });
  }

  async createRole(createRoleDto: CreateRoleDto): Promise<roles> {
    return await this.prisma.roles.create({
      data: {
        ...createRoleDto,
      },
    });
  }
}
