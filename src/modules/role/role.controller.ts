import { Get } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { RoleService } from './role.service';

@Controller('role')
export class RoleController {
  constructor(private roleService: RoleService) {}
  @Get('/')
  findAllUser() {
    return this.roleService.getAllRole();
  }
}
