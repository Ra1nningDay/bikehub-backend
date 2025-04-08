import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { MotorbikesService } from './motorbike.service';
import { CreateMotorbikeDto } from './dto/create-motorbike.dto';
import { UpdateMotorbikeDto } from './dto/update-motorbike.dto';

@Controller('motorbikes')
export class MotorbikesController {
  constructor(private readonly motorbikesService: MotorbikesService) {}

  @Post()
  create(@Body() createMotorbikeDto: CreateMotorbikeDto) {
    return this.motorbikesService.create(createMotorbikeDto);
  }

  @Get()
  findAll() {
    return this.motorbikesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.motorbikesService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMotorbikeDto: UpdateMotorbikeDto,
  ) {
    return this.motorbikesService.update(id, updateMotorbikeDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.motorbikesService.remove(id);
  }
}
