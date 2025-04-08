import { IsString, IsOptional, MaxLength } from 'class-validator';

export class UpdateMotorbikeBrandDto {
  @IsString()
  @IsOptional()
  @MaxLength(50)
  name?: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;
}
