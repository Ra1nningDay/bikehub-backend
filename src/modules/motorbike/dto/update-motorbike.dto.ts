import { IsString, IsNumber, IsPositive, IsOptional } from 'class-validator';
import { Type, Expose } from 'class-transformer'; // <--- Import Type และ Expose จาก class-transformer

export class UpdateMotorbikeDto {
  @Expose() // <-- เพิ่ม Expose เพื่อให้แน่ใจว่า property นี้จะถูกรวมเมื่อมีการ transform (เช่น ใช้กับ ClassSerializerInterceptor)
  @IsString()
  @IsOptional()
  name?: string;

  @Expose()
  @Type(() => Number) // <--- ใช้ @Type(() => Number) เพื่อบอกให้แปลงเป็น Number
  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;

  @Expose()
  @Type(() => Number) // <--- ใช้ @Type(() => Number)
  @IsNumber() // ยังคงใช้ IsNumber() ได้ หรือจะใช้ IsInt() อย่างเดียวก็ได้ถ้ามั่นใจว่าเป็น Integer
  @IsPositive()
  @IsOptional()
  brand_id?: number;

  @Expose()
  @IsString() // <-- เพิ่ม IsString ถ้า image ควรเป็น string
  @IsOptional()
  image?: string;
}
