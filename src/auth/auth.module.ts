import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/User.entity';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from './config/jwt.config';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ConfigModule.forFeature(jwtConfig),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
