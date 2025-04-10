import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingService {
  constructor(private readonly prisma: PrismaService) {}

  async createBooking(createBookingDto: CreateBookingDto) {
    return this.prisma.bookings.create({
      data: {
        user_id: createBookingDto.user_id,
        motorbike_id: createBookingDto.motorbike_id,
        pickup_location: createBookingDto.pickup_location,
        dropoff_location: createBookingDto.dropoff_location,
        pickup_date: createBookingDto.pickup_date,
        dropoff_date: createBookingDto.dropoff_date,
        total_price: createBookingDto.total_price,
        status: createBookingDto.status || 'pending',
      },
    });
  }

  async getBookingById(id: number) {
    return this.prisma.bookings.findUnique({
      where: { id },
      include: {
        motorbike: true,
        user: true,
        payment: true,
      },
    });
  }

  async getAllBookings() {
    return this.prisma.bookings.findMany({
      include: {
        motorbike: true,
        user: true,
        payment: true,
      },
    });
  }

  async getBookingsByUser(user_id: number) {
    return this.prisma.bookings.findMany({
      where: {
        user_id,
      },
    });
  }
}
