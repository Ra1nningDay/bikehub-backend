import { Body, Get, Post, Param, UseGuards } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('role')
@UseGuards(AuthGuard('jwt'))
export class RoleController {
  constructor(private roleService: RoleService) {}
  @Get('/')
  findAllRole() {
    return this.roleService.getAllRole();
  }

  @Get('/:id')
  findRole(@Param('id') id: string) {
    return this.roleService.getById(+id);
  }

  @Post('/')
  createRole(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.createRole(createRoleDto);
  }
}
