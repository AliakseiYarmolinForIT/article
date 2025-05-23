// адаптер для работы с jwt
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenPayload } from '../types/refresh-token-payload.type';

@Injectable()
export class JwtAdapter {
  public constructor(private readonly jwtService: JwtService) {}
  public async createAccessAndRefreshTokens({
    userId,
    deviceId,
  }: {
    userId: string;
    deviceId: string;
  }) {
    const accessToken = await this.createToken({
      payload: { userId },
      secret: process.env.JWT_SECRET_ACCESS as string,
      expiresIn: process.env.JWT_LIFE_TIME_ACCESS as string,
    });

    const refreshToken = await this.createToken({
      payload: { userId, deviceId },
      secret: process.env.JWT_SECRET_REFRESH as string,
      expiresIn: process.env.JWT_LIFE_TIME_REFRESH as string,
    });

    const payload: RefreshTokenPayload =
      await this.jwtService.decode(refreshToken);

    return { accessToken, refreshToken, payload };
  }

  private async createToken({
    payload,
    secret,
    expiresIn,
  }: {
    payload: object;
    secret: string;
    expiresIn: string;
  }): Promise<string> {
    return this.jwtService.signAsync(payload, { secret, expiresIn });
  }
}
