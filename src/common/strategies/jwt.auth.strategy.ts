import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AccessTokenPayload } from '../types/access-token-payload.type';

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy) {
  public constructor() {
    const accessSecretKey = process.env.JWT_SECRET_ACCESS as string;

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: accessSecretKey,
    });
  }

  public async validate(payload: AccessTokenPayload) {
    return { userId: payload.userId };
  }
}
