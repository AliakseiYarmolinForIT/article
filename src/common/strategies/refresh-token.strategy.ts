import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { SessionRepository } from 'src/features/user/infrastructure/repositories/session.repository';
import { SECOND_TO_MILLISECOND } from '../constants/constants';
import { SessionFields } from 'src/features/user/common/enums/session-fields.enum';
import { RefreshTokenPayload } from '../types/refresh-token-payload.type';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  public constructor(private readonly sessionRepository: SessionRepository) {
    const refreshSecretKey = process.env.JWT_SECRET_REFRESH as string;

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.refreshToken as string;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: refreshSecretKey,
    });
  }

  public async validate(payload: RefreshTokenPayload) {
    const session = await this.sessionRepository.getSessionByField({
      field: SessionFields.Id,
      value: payload.deviceId,
    });

    if (!session) {
      return null;
    }

    if (
      session.lastActiveDate.getTime() !==
      new Date(payload.iat * SECOND_TO_MILLISECOND).getTime()
    ) {
      return null;
    }

    return { userId: payload.userId, deviceId: payload.deviceId };
  }
}
