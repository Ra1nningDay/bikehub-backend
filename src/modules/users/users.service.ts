import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { users } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PaginatedResponse, PaginationDto } from 'src/common/dto';
import { LoggerService } from 'src/common/logger.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private logger: LoggerService,
  ) {}
  async createUser(createUserDto: CreateUserDto): Promise<users> {
    const exitingUser = await this.prisma.users.findUnique({
      where: {
        email: createUserDto.email,
      },
    });
    if (exitingUser) {
      this.logger.error(
        `Registration failed: Email ${createUserDto.email} already exists`,
      );
      throw new BadRequestException('User already exits');
    }
    const saltRound = 10;
    const hash: string = await bcrypt.hash(createUserDto.password, saltRound);

    const role = await this.prisma.roles.findFirst({
      where: {
        title: 'user',
      },
    });

    if (!role) {
      throw new NotFoundException('Role "user" not found');
    }

    return this.prisma.users.create({
      data: {
        username: createUserDto.email,
        email: createUserDto.email,
        password: hash,
        avatar: 'default-avatar.png',
        oauth_id: '',
        oauth_provider: '',
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

  async findAll(
    paginationDto: PaginationDto,
  ): Promise<PaginatedResponse<users>> {
    const { page, limit } = paginationDto;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this.prisma.users.findMany({
        skip,
        take: limit,
        include: {
          user_roles: {
            include: {
              role: true,
            },
          },
        },
      }),
      this.prisma.users.count(),
    ]);

    return {
      data: users,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    return this.prisma.users.findUniqueOrThrow({
      where: { id },
      include: {
        user_roles: {
          include: {
            role: true,
          },
        },
      },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.users.findUnique({ where: { id } });
    if (!user) {
      throw new BadRequestException('User not Found');
    }

    return this.prisma.users.update({
      where: { id },
      data: { ...updateUserDto },
      include: {
        user_roles: {
          include: {
            role: true,
          },
        },
      },
    });
  }

  remove(id: number) {
    return this.prisma.users.delete({
      where: { id },
    });
  }
}
