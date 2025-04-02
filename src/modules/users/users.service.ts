import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { users } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  async createUser(createUserDto: CreateUserDto): Promise<users> {
    const saltRound = 10;
    const hash: string = await bcrypt.hash(createUserDto.password, saltRound);

    const role = await this.prisma.roles.findFirst({
      where: {
        title: 'user',
      },
    });

    if (!role) {
      throw new Error('Role "user" not found');
    }

    return this.prisma.users.create({
      data: {
        username: createUserDto.username,
        email: createUserDto.email,
        password: hash,
        avatar: 'default-avatar.png',
        user_roles: {
          create: [
            {
              role: {
                connect: {
                  id: role.id,
                },
              },
            },
          ],
        },
      },
      include: {
        user_roles: {
          include: {
            role: true,
          },
        },
      },
    });
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.prisma.users.update({
      where: { id },
      data: { ...updateUserDto },
    });
  }

  remove(id: number) {
    return this.prisma.users.delete({
      where: { id },
    });
  }
}
