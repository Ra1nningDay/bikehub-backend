import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
} from '@nestjs/common';
import { MotorbikeBrandsService } from './motorbike-brands.service';
import { CreateMotorbikeBrandDto } from './dto/create-motorbike-brand.dto';
import { UpdateMotorbikeBrandDto } from './dto/update-motorbike-brand.dto';

@Controller('motorbike-brands')
export class MotorbikeBrandsController {
  constructor(
    private readonly motorbikeBrandsService: MotorbikeBrandsService,
  ) {}

  @Post()
  async create(@Body() createMotorbikeBrandDto: CreateMotorbikeBrandDto) {
    return await this.motorbikeBrandsService.create(createMotorbikeBrandDto);
  }

  @Get()
  async findAll() {
    return await this.motorbikeBrandsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.motorbikeBrandsService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMotorbikeBrandDto: UpdateMotorbikeBrandDto,
  ) {
    return await this.motorbikeBrandsService.update(
      id,
      updateMotorbikeBrandDto,
    );
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.motorbikeBrandsService.remove(id);
  }
}
