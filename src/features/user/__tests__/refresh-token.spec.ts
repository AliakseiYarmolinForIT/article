import { Test, TestingModule } from '@nestjs/testing';
import { SessionRepository } from '../infrastructure/repositories/session.repository';
import { SessionEntity } from '../domain/entities/session.entity';
import { RefreshTokenPayload } from 'src/common/types/refresh-token-payload.type';
import { JwtAdapter } from '../../../common/jwt/jwt.adapter';
import {
  RefreshTokenCommand,
  RefreshTokenUseCase,
} from '../application/use-cases/refresh-token.use-case';
import { SECOND_TO_MILLISECOND } from '../../../common/constants/constants';

describe('RefreshTokenUseCase', () => {
  let refreshTokenUseCase: RefreshTokenUseCase;
  let sessionRepository: SessionRepository;
  let jwtAdapter: JwtAdapter;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RefreshTokenUseCase,
        {
          provide: SessionRepository,
          useValue: {
            getSessionByField: jest.fn(), // создание заглушки
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

    refreshTokenUseCase = module.get<RefreshTokenUseCase>(RefreshTokenUseCase);
    sessionRepository = module.get<SessionRepository>(SessionRepository);
    jwtAdapter = module.get<JwtAdapter>(JwtAdapter);
  });

  it('should refresh token ', async () => {
    const userId = '1';
    const deviceId = 'uuid';

    const command = new RefreshTokenCommand({
      userId,
      deviceId,
    });

    const searchExtendedSessionResult = new SessionEntity();

    searchExtendedSessionResult.id = 'uuid';
    searchExtendedSessionResult.userId = Number(userId);
    searchExtendedSessionResult.ipAddress = 'existIpAddress';
    searchExtendedSessionResult.deviceName = 'existDeviceName';
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
        deviceId,
        iat: 11111,
        exp: 33333,
      },
    };
    jest
      .spyOn(jwtAdapter, 'createAccessAndRefreshTokens')
      .mockResolvedValue(creatingAccessAndRefreshTokensResult);

    const result = await refreshTokenUseCase.execute(command);

    expect(jwtAdapter.createAccessAndRefreshTokens).toHaveBeenCalledWith({
      userId,
      deviceId,
    });

    expect(sessionRepository.saveSession).toHaveBeenCalledWith({
      id: deviceId,
      userId: Number(userId),
      ipAddress: searchExtendedSessionResult.ipAddress,
      deviceName: searchExtendedSessionResult.deviceName,
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
