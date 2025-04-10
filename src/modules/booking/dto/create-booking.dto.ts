import { IsString, IsDateString, IsNumber, IsOptional } from 'class-validator';

export class CreateBookingDto {
  @IsNumber()
  readonly user_id: number;

  @IsNumber()
  readonly motorbike_id: number;

  @IsString()
  readonly pickup_location: string;

  @IsString()
  readonly dropoff_location: string;

  @IsDateString()
  readonly pickup_date: Date;

  @IsDateString()
  readonly dropoff_date: Date;

  @IsNumber()
  readonly total_price: number;

  @IsString()
  @IsOptional()
  readonly status: string;
}
