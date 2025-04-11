import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('paymentProof', {
      storage: diskStorage({
        destination: './uploads/payments',
        filename: (req, file, cb) => {
          const filename = `${Date.now()}-${file.originalname}`;
          cb(null, filename);
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|pdf/;
        const ext = file.originalname
          .toLowerCase()
          .match(/\.(jpg|jpeg|png|pdf)$/);
        const mimetype = allowedTypes.test(file.mimetype);

        if (ext && mimetype) {
          cb(null, true);
        } else {
          cb(
            new BadRequestException(
              'Only JPEG, PNG, and PDF files are allowed',
            ),
            false,
          );
        }
      },
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async createPayment(
    @Body() createPaymentDto: CreatePaymentDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const result = await this.paymentService.createPayment(
      createPaymentDto,
      file,
    );

    return {
      message: 'Payment and booking created successfully',
      payment: result.payment,
      booking: result.booking,
    };
  }
}
