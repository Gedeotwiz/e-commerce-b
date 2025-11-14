import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module'; 
import { JwtModule } from '@nestjs/jwt';
import { EmailService } from 'src/common/mailler';
import { TokenService } from 'src/common/token-service';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from 'src/__share__/utils/jwt-stratege';
import { RolesGuard } from 'src/__share__/guards/role-guard';

@Module({
  imports: [
    ConfigModule,
    UserModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'superSecretKey',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, EmailService, TokenService,JwtStrategy],
  exports: [AuthService, EmailService, TokenService],
})
export class AuthModule {}
