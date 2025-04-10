import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsInt, // Import IsInt
} from 'class-validator';
import { Type, Expose } from 'class-transformer'; // Import Type และ Expose

export class CreateMotorbikeDto {
  @Expose() // เพิ่ม Expose
  @IsString()
  @IsNotEmpty()
  name: string;

  @Expose() // เพิ่ม Expose
  @Type(() => Number) // <--- ใช้ @Type แทน @Transform
  @IsNotEmpty()
  @IsNumber() // ยังคงใช้ IsNumber หรือจะเอาออกถ้าใช้ IsPositive แล้วมั่นใจ
  @IsPositive() // ตรวจสอบว่าเป็นค่าบวก
  price: number;

  @Expose() // เพิ่ม Expose
  @Type(() => Number) // <--- ใช้ @Type แทน @Transform
  @IsNotEmpty()
  @IsInt() // <--- ใช้ IsInt เพื่อให้แน่ใจว่าเป็นจำนวนเต็ม
  @IsPositive() // <--- เพิ่ม IsPositive สำหรับ ID
  brand_id: number;
}
