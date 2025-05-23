import { Module } from '@nestjs/common';
import { AuthController } from './api/controllers/auth.controller';
import { RegistrationUserUseCase } from './application/use-cases/registration.user.use-case';
import { UserRepository } from './infrastructure/repositories/user.repository';
import { UserQueryRepository } from './infrastructure/repositories/user-query.repository';
import { CqrsModule } from '@nestjs/cqrs';
import { LoginUserUseCase } from './application/use-cases/login-user.use-case';
import { SessionRepository } from './infrastructure/repositories/session.repository';
import { RefreshTokenUseCase } from './application/use-cases/refresh-token.use-case';
import { LogoutUserUseCase } from './application/use-cases/logout-user.use-case';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from 'src/common/strategies/local.auth.strategy';
import { RefreshTokenStrategy } from 'src/common/strategies/refresh-token.strategy';
import { JwtAuthStrategy } from 'src/common/strategies/jwt.auth.strategy';
import { JwtAdapter } from 'src/common/jwt/jwt.adapter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './domain/entities/user.entity';
import { SessionEntity } from './domain/entities/session.entity';
import { UserMapper } from './api/mappers/user.mapper';

const stratigies = [LocalStrategy, RefreshTokenStrategy, JwtAuthStrategy];

const useCases = [
  RegistrationUserUseCase,
  LoginUserUseCase,
  RefreshTokenUseCase,
  LogoutUserUseCase,
];

const repositories = [UserQueryRepository, UserRepository, SessionRepository];

@Module({
  imports: [
    CqrsModule,
    JwtModule.register({}),
    TypeOrmModule.forFeature([UserEntity, SessionEntity]),
  ],
  controllers: [AuthController],
  providers: [
    UserMapper,
    JwtAdapter,
    ...stratigies,
    ...useCases,
    ...repositories,
  ],
})
export class AuthModule {}
