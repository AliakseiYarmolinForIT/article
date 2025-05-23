import { Test, TestingModule } from '@nestjs/testing';
import { SessionRepository } from '../infrastructure/repositories/session.repository';
import {
  LogoutUserCommand,
  LogoutUserUseCase,
} from '../application/use-cases/logout-user.use-case';

describe('LogoutUserUseCase', () => {
  let logoutUserUseCase: LogoutUserUseCase;
  let sessionRepository: SessionRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LogoutUserUseCase,
        {
          provide: SessionRepository,
          useValue: {
            deleteSessionById: jest.fn(), // создание заглушки
          },
        },
      ],
    }).compile();

    logoutUserUseCase = module.get<LogoutUserUseCase>(LogoutUserUseCase);
    sessionRepository = module.get<SessionRepository>(SessionRepository);
  });

  it('should logout user ', async () => {
    const deviceId = 'uuid';

    const command = new LogoutUserCommand({
      deviceId,
    });

    await logoutUserUseCase.execute(command);

    expect(sessionRepository.deleteSessionById).toHaveBeenCalledWith({
      id: deviceId,
    });
  });
});
