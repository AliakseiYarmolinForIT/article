import { CommandBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { RegistrationUserDto } from '../dto/registration-user.dto';
import { RegistrationUserCommand } from '../../application/use-cases/registration.user.use-case';
import { CurrentUserId } from 'src/common/decorators/current-user-id.decorator';
import { CurrentUserViewModel } from '../view-models/current-user.view-model';
import { UserQueryRepository } from '../../infrastructure/repositories/user-query.repository';
import { UserMapper } from '../mappers/user.mapper';
import { Request, Response } from 'express';
import { AccessTokenViewModel } from '../view-models/access-token.view-model';
import { IdViewModel } from 'src/common/view-models/id.view-model';
import { LoginUserCommand } from '../../application/use-cases/login-user.use-case';
import { RefreshTokenCommand } from '../../application/use-cases/refresh-token.use-case';
import { RefreshTokenInformation } from '../decorators/refresh-token-information.decorator';
import { LogoutUserCommand } from '../../application/use-cases/logout-user.use-case';
import { LocalAuthGuard } from 'src/common/guards/local.auth.guard';
import { RefreshTokenGuard } from 'src/common/guards/refresh-token.auth.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt.auth.guard';
import { TokensPairDto } from '../../common/types/tokens-pair.type';
import { IdDto } from 'src/common/types/id.type';
import { MeSwagger } from '../swagger/me.swagger.decorator';
import { LogoutUserSwagger } from '../swagger/logout.swagger.decorator';
import { RefreshTokenSwagger } from '../swagger/refresh-token.swagger.decoretor';
import { LoginUserSwagger } from '../swagger/login.swagger.decorator';
import { RegistrationUserSwagger } from '../swagger/registration-user.swagger.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  public constructor(
    private readonly commandBus: CommandBus,
    private readonly userMapper: UserMapper,
    private readonly userRepository: UserQueryRepository,
  ) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('registration')
  @RegistrationUserSwagger()
  public async registration(
    @Body() inputModel: RegistrationUserDto,
  ): Promise<IdViewModel> {
    return await this.commandBus.execute<RegistrationUserCommand, IdDto>(
      new RegistrationUserCommand(inputModel),
    );
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @LoginUserSwagger()
  public async login(
    @CurrentUserId() userInfo: { userId: string },
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AccessTokenViewModel> {
    const deviceName: string = req.headers['user-agent'] || 'unknown';
    const ipAddress: string =
      (req.headers['x-client-ip'] as string) || ('unknown' as string);

    const result = await this.commandBus.execute<
      LoginUserCommand,
      TokensPairDto
    >(
      new LoginUserCommand({
        ipAddress,
        deviceName,
        userId: userInfo.userId,
      }),
    );

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });

    return { accessToken: result.accessToken };
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshTokenGuard)
  @Post('refresh-token')
  @RefreshTokenSwagger()
  public async refreshToken(
    @RefreshTokenInformation()
    userInformation: { userId: string; deviceId: string },
    @Res({ passthrough: true }) res: Response,
  ): Promise<AccessTokenViewModel> {
    const result = await this.commandBus.execute<
      RefreshTokenCommand,
      TokensPairDto
    >(
      new RefreshTokenCommand({
        userId: userInformation.userId,
        deviceId: userInformation.deviceId,
      }),
    );

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });

    return { accessToken: result.accessToken };
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(RefreshTokenGuard)
  @Post('logout')
  @LogoutUserSwagger()
  public async logout(
    @RefreshTokenInformation()
    userInformation: { userId: string; deviceId: string },
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    await this.commandBus.execute(
      new LogoutUserCommand({
        deviceId: userInformation.deviceId,
      }),
    );

    res.clearCookie('refreshToken');

    return;
  }

  // дополнительный endpoint, который не был указан в ТЗ
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Get('me')
  @MeSwagger()
  public async getInformationAboutCerruntUser(
    @CurrentUserId() userInfo: { userId: string },
  ): Promise<CurrentUserViewModel> {
    const user = await this.userRepository.getUserById({
      id: userInfo.userId,
    });

    if (!user) throw new NotFoundException('user not found');

    return this.userMapper.toCurrentUsersViewModel(user);
  }
}
