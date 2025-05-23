import { randomUUID } from 'crypto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionRepository } from '../../infrastructure/repositories/session.repository';
import { JwtAdapter } from '../../../../common/jwt/jwt.adapter';
import { SessionEntity } from '../../domain/entities/session.entity';
import { SECOND_TO_MILLISECOND } from '../../../../common/constants/constants';
import { TokensPairDto } from '../../common/types/tokens-pair.type';
import { SessionFields } from '../../common/enums/session-fields.enum';

export class LoginUserCommand {
  public constructor(
    public dto: { userId: string; ipAddress: string; deviceName: string },
  ) {}
}

@CommandHandler(LoginUserCommand)
export class LoginUserUseCase implements ICommandHandler<LoginUserCommand> {
  public constructor(
    private readonly sessionRepository: SessionRepository,
    private readonly jwtAdapter: JwtAdapter,
  ) {}
  public async execute(command: LoginUserCommand): Promise<TokensPairDto> {
    const { userId, ipAddress, deviceName } = command.dto;

    const extendedSession = await this.sessionRepository.getSessionByField({
      field: SessionFields.UserId,
      value: userId,
    });

    // в данном подходе реализован функционал, обеспечивающий наличие только одной сессии. при необходимости можно внести правки, которые позволят реализовать "мультидевайсность"
    if (extendedSession) {
      await this.sessionRepository.deleteSessionById({
        id: extendedSession.id,
      });
    }

    const deviceId = randomUUID();

    const { accessToken, refreshToken, payload } =
      await this.jwtAdapter.createAccessAndRefreshTokens({
        userId,
        deviceId,
      });

    const lastActiveDate = new Date(payload.iat * SECOND_TO_MILLISECOND);

    const session = SessionEntity.createSession({
      deviceId,
      userId,
      ipAddress,
      deviceName,
      lastActiveDate,
    });

    await this.sessionRepository.saveSession(session);

    return { accessToken, refreshToken };
  }
}
