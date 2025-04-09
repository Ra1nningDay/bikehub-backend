import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateMotorbikeDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  price: number;

  @IsNotEmpty()
  brand_id: number;

  @IsString()
  image: string;
}
