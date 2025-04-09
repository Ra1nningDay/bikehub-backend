import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateMotorbikeDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Transform(({ value }) =>
    typeof value === 'string' ? parseFloat(value) : value,
  ) // แปลงจาก string เป็น number
  price: number;

  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) =>
    typeof value === 'string' ? parseInt(value, 10) : value,
  ) // แปลงจาก string เป็น number
  brand_id: number;
}
