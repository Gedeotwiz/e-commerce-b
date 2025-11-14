import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TokenService {
  constructor(private readonly configService: ConfigService) {}

  generateEmailToken(email: string): string {
    const secret = this.configService.get('JWT_SECRET');
    return jwt.sign({ email }, secret, { expiresIn: '1d' });
  }

  verifyEmailToken(token: string): any {
    const secret = this.configService.get('JWT_SECRET');
    return jwt.verify(token, secret);
  }
}
