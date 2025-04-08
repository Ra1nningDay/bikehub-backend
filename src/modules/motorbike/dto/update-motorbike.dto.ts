import { IsString, IsNumber, IsPositive, IsOptional } from 'class-validator';

export class UpdateMotorbikeDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;

  @IsPositive()
  @IsOptional()
  brand_id?: number;
}
