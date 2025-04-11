import {
  IsNumber,
  IsString,
  IsDateString,
  IsEnum,
  IsNotEmpty,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreatePaymentDto {
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  user_id: number;

  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  motorbike_id: number;

  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  amount: number;

  @IsEnum(['qr', 'credit', 'bank'], {
    message: 'paymentMethod must be one of: qr, credit, bank',
  })
  @IsNotEmpty()
  paymentMethod: string;

  @IsString()
  @IsNotEmpty()
  pickup_location: string;

  @IsString()
  @IsNotEmpty()
  dropoff_location: string;

  @IsDateString()
  pickup_date: Date;

  @IsDateString()
  dropoff_date: Date;

  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  total_price: number;
}
