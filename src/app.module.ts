import { Module } from '@nestjs/common';
import { RoleModule } from './modules/role/role.module';
import { UsersModule } from './modules/users/users.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { LoggerService } from './common/logger.service';
import { MotorbikeModule } from './modules/motorbike/motorbike.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot({
      throttlers: [{ ttl: 60, limit: 10 }],
    }),
    RoleModule,
    UsersModule,
    PrismaModule,
    AuthModule,
    MotorbikeModule,
  ],
  providers: [LoggerService],
})
export class AppModule {}
