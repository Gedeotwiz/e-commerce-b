import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_SECRET') || 'mySuperSecretKey',
      ignoreExpiration: false, 
    });
  }

  async validate(payload: JwtPayload) {
    const role = payload.role ? payload.role.toString().toUpperCase() : 'GUEST';

    return {
      userId: payload.sub,
      email: payload.email,
      role,
    };
  }
}
