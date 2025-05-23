import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionRepository } from '../../infrastructure/repositories/session.repository';
import { JwtAdapter } from '../../../../common/jwt/jwt.adapter';
import { SECOND_TO_MILLISECOND } from '../../../../common/constants/constants';
import { TokensPairDto } from '../../common/types/tokens-pair.type';
import { SessionFields } from '../../common/enums/session-fields.enum';

export class RefreshTokenCommand {
  public constructor(public dto: { userId: string; deviceId: string }) {}
}

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenUseCase
  implements ICommandHandler<RefreshTokenCommand>
{
  public constructor(
    private readonly sessionRepository: SessionRepository,
    private readonly jwtAdapter: JwtAdapter,
  ) {}
  public async execute(command: RefreshTokenCommand): Promise<TokensPairDto> {
    const { userId, deviceId } = command.dto;

    const session = await this.sessionRepository.getSessionByField({
      field: SessionFields.Id,
      value: deviceId,
    });

    const { accessToken, refreshToken, payload } =
      await this.jwtAdapter.createAccessAndRefreshTokens({
        userId,
        deviceId,
      });

    const lastActiveDate = new Date(payload.iat * SECOND_TO_MILLISECOND);

    session!.updateLastActiveDate({ lastActiveDate });

    await this.sessionRepository.saveSession(session!);

    return { accessToken, refreshToken };
  }
}
