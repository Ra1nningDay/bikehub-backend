// motorbike.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MotorbikesService } from './motorbike.service';
import { CreateMotorbikeDto } from './dto/create-motorbike.dto';
import { UpdateMotorbikeDto } from './dto/update-motorbike.dto';

@Controller('motorbikes')
export class MotorbikesController {
  constructor(private readonly motorbikesService: MotorbikesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() createMotorbikeDto: CreateMotorbikeDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log('Received createMotorbikeDto:', createMotorbikeDto);
    console.log(
      'Received file:',
      file ? file.originalname : 'No file uploaded',
    );

    return await this.motorbikesService.create(createMotorbikeDto, file);
  }

  @Get()
  async findAll() {
    return await this.motorbikesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.motorbikesService.findOne(id);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMotorbikeDto: UpdateMotorbikeDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return await this.motorbikesService.update(id, updateMotorbikeDto, file);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.motorbikesService.remove(id);
  }
}
