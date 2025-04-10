import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Jwt } from 'custom-types';
import { AuthGuard } from '@nestjs/passport';

@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  async createBooking(@Body() createBookingDto: CreateBookingDto) {
    return await this.bookingService.createBooking(createBookingDto);
  }

  @Get(':id')
  async getBooking(@Param('id') id: number) {
    return await this.bookingService.getBookingById(id);
  }

  @Get()
  async getAllBookings() {
    return await this.bookingService.getAllBookings();
  }

  @Get('user/:userId')
  async getBookingsByUserId(@Param('userId') userId: string) {
    return await this.bookingService.getBookingsByUserId(+userId);
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  async getMyBookings(@Req() req: Jwt) {
    return await this.bookingService.getBookingsByUser(req.user.id);
  }
}
