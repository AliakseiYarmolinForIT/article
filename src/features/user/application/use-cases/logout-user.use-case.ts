import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionRepository } from '../../infrastructure/repositories/session.repository';

export class LogoutUserCommand {
  public constructor(public dto: { deviceId: string }) {}
}

@CommandHandler(LogoutUserCommand)
export class LogoutUserUseCase implements ICommandHandler<LogoutUserCommand> {
  public constructor(private readonly sessionRepository: SessionRepository) {}
  public async execute(command: LogoutUserCommand): Promise<void> {
    await this.sessionRepository.deleteSessionById({
      id: command.dto.deviceId,
    });
  }
}
