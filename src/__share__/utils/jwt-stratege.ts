
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_SECRET') || 'mySuperSecretKey',
    });
  }

  async validate(payload: any) {
    return {
      sub: payload.sub,
      userId: payload.sub,
      email: payload.email,
      role: typeof payload.role === 'string' ? payload.role.toUpperCase() : payload.role,
    };
  }
}
