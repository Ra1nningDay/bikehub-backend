// src/payments/payments.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BookingService } from '../booking/booking.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PaymentService {
  constructor(
    private prisma: PrismaService,
    private bookingService: BookingService,
  ) {}

  async createPayment(dto: CreatePaymentDto, file?: Express.Multer.File) {
    // For QR code payments, ensure a file is uploaded
    if (dto.paymentMethod === 'qr' && !file) {
      throw new BadRequestException(
        'Payment proof is required for QR code payments',
      );
    }

    // Create the payment record
    const payment = await this.prisma.payments.create({
      data: {
        user_id: dto.user_id,
        motorbike_id: dto.motorbike_id,
        amount: dto.amount,
        currency: 'USD',
        status: dto.paymentMethod === 'qr' ? 'pending' : 'completed',
        payment_method: dto.paymentMethod,
        receipt_url: file ? `/uploads/payments/${file.filename}` : null,
        description: `Payment for motorbike booking (ID: ${dto.motorbike_id})`,
        created_at: new Date(),
        updated_at: new Date(),
        stripe_payment_id:
          dto.paymentMethod === 'qr' ? uuidv4() : `pay_${Date.now()}`,
      },
    });

    // Create the associated booking using BookingService
    const booking = await this.bookingService.createBooking({
      user_id: dto.user_id,
      motorbike_id: dto.motorbike_id,
      pickup_location: dto.pickup_location,
      dropoff_location: dto.dropoff_location,
      pickup_date: dto.pickup_date,
      dropoff_date: dto.dropoff_date,
      total_price: dto.total_price,
      status: 'pending',
    });

    // Update the booking with the payment_id
    await this.prisma.bookings.update({
      where: { id: booking.id },
      data: { payment_id: payment.id },
    });

    return { payment, booking };
  }
}
