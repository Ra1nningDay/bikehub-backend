import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { roles } from '@prisma/client';

@Injectable()
export class RoleService {
  constructor(private prisma: PrismaService) {}
  getAllRole(): Promise<roles[]> {
    return this.prisma.roles.findMany();
  }
}
