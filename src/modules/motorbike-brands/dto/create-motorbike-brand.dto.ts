import { IsString, IsOptional, MaxLength } from 'class-validator';

export class CreateMotorbikeBrandDto {
  @IsString()
  @MaxLength(50)
  name: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;
}
