import { Test, TestingModule } from '@nestjs/testing';
import { SessionRepository } from '../infrastructure/repositories/session.repository';
import {
  LoginUserCommand,
  LoginUserUseCase,
} from '../application/use-cases/login-user.use-case';
import { SessionEntity } from '../domain/entities/session.entity';
import { RefreshTokenPayload } from 'src/common/types/refresh-token-payload.type';
import { JwtAdapter } from '../../../common/jwt/jwt.adapter';
import { SessionFields } from '../common/enums/session-fields.enum';
import { SECOND_TO_MILLISECOND } from '../../../common/constants/constants';

describe('LoginUserUseCase', () => {
  let loginUserUseCase: LoginUserUseCase;
  let sessionRepository: SessionRepository;
  let jwtAdapter: JwtAdapter;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoginUserUseCase,
        {
          provide: SessionRepository,
          useValue: {
            getSessionByField: jest.fn(), // создание заглушки
            deleteSessionById: jest.fn(), // создание заглушки
            saveSession: jest.fn(), // создание заглушки
          },
        },
        {
          provide: JwtAdapter,
          useValue: {
            createAccessAndRefreshTokens: jest.fn(), // создание заглушки
          },
        },
      ],
    }).compile();

    loginUserUseCase = module.get<LoginUserUseCase>(LoginUserUseCase);
    sessionRepository = module.get<SessionRepository>(SessionRepository);
    jwtAdapter = module.get<JwtAdapter>(JwtAdapter);
  });

  it('should login user if session is exist', async () => {
    const userId = '1';
    const ipAddress = 'newIpAddress';
    const deviceName = 'newDeviceName';

    const command = new LoginUserCommand({
      userId,
      ipAddress,
      deviceName,
    });

    const searchExtendedSessionResult: SessionEntity | null = {
      id: 'existUuid',
      userId: Number(userId),
      ipAddress: 'existTestIpAddress',
      deviceName: 'existTestDeviceName',
    } as unknown as SessionEntity;
    jest
      .spyOn(sessionRepository, 'getSessionByField')
      .mockResolvedValue(searchExtendedSessionResult);

    const creatingAccessAndRefreshTokensResult: {
      accessToken: string;
      refreshToken: string;
      payload: RefreshTokenPayload;
    } = {
      accessToken: 'newAccessToken',
      refreshToken: 'newRefreshToken',
      payload: {
        userId,
        deviceId: 'newUuid',
        iat: 11111,
        exp: 33333,
      },
    };
    jest
      .spyOn(jwtAdapter, 'createAccessAndRefreshTokens')
      .mockResolvedValue(creatingAccessAndRefreshTokensResult);

    const result = await loginUserUseCase.execute(command);

    expect(sessionRepository.getSessionByField).toHaveBeenCalledWith({
      field: SessionFields.UserId,
      value: userId,
    });

    expect(sessionRepository.deleteSessionById).toHaveBeenCalledWith({
      id: searchExtendedSessionResult.id,
    });

    expect(jwtAdapter.createAccessAndRefreshTokens).toHaveBeenCalledWith({
      userId,
      deviceId: expect.any(String),
    });

    expect(sessionRepository.saveSession).toHaveBeenCalledWith({
      id: expect.any(String),
      userId: Number(userId),
      ipAddress,
      deviceName,
      lastActiveDate: new Date(
        creatingAccessAndRefreshTokensResult.payload.iat *
          SECOND_TO_MILLISECOND,
      ),
    });

    expect(result).toEqual({
      accessToken: creatingAccessAndRefreshTokensResult.accessToken,
      refreshToken: creatingAccessAndRefreshTokensResult.refreshToken,
    });
  });

  it('should login user if session is not exist', async () => {
    const userId = '1';
    const ipAddress = 'ipAddress';
    const deviceName = 'deviceName';

    const command = new LoginUserCommand({
      userId,
      ipAddress,
      deviceName,
    });

    const searchExtendedSessionResult: SessionEntity | null = null;
    jest
      .spyOn(sessionRepository, 'getSessionByField')
      .mockResolvedValue(searchExtendedSessionResult);

    const creatingAccessAndRefreshTokensResult: {
      accessToken: string;
      refreshToken: string;
      payload: RefreshTokenPayload;
    } = {
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
      payload: {
        userId,
        deviceId: 'uuid',
        iat: 11111,
        exp: 33333,
      },
    };
    jest
      .spyOn(jwtAdapter, 'createAccessAndRefreshTokens')
      .mockResolvedValue(creatingAccessAndRefreshTokensResult);

    const result = await loginUserUseCase.execute(command);

    expect(sessionRepository.getSessionByField).toHaveBeenCalledWith({
      field: SessionFields.UserId,
      value: userId,
    });

    expect(sessionRepository.deleteSessionById).toHaveBeenCalledTimes(0);

    expect(jwtAdapter.createAccessAndRefreshTokens).toHaveBeenCalledWith({
      userId,
      deviceId: expect.any(String),
    });

    expect(sessionRepository.saveSession).toHaveBeenCalledWith({
      id: expect.any(String),
      userId: Number(userId),
      ipAddress,
      deviceName,
      lastActiveDate: new Date(
        creatingAccessAndRefreshTokensResult.payload.iat *
          SECOND_TO_MILLISECOND,
      ),
    });

    expect(result).toEqual({
      accessToken: creatingAccessAndRefreshTokensResult.accessToken,
      refreshToken: creatingAccessAndRefreshTokensResult.refreshToken,
    });
  });
});
