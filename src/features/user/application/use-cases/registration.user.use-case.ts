import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import * as bcrypt from 'bcrypt';

import { RegistrationUserDto } from '../../api/dto/registration-user.dto';
import { UserRepository } from '../../infrastructure/repositories/user.repository';
import { BadRequestException } from '@nestjs/common';
import { UserEntity } from '../../domain/entities/user.entity';
import { IdDto } from 'src/common/types/id.type';
import { SALT_OR_ROUNDS } from '../../common/constants/constants';
import { UserFields } from '../../common/enums/user-fields.enum';

export class RegistrationUserCommand {
  public constructor(public dto: RegistrationUserDto) {}
}

@CommandHandler(RegistrationUserCommand)
export class RegistrationUserUseCase
  implements ICommandHandler<RegistrationUserCommand>
{
  public constructor(private readonly userRepository: UserRepository) {}

  public async execute(command: RegistrationUserCommand): Promise<IdDto> {
    // в данном подходе реализована простая логика регистрации новых пользователей
    // при необходимости можно реализовать механизм отправки уведомдения + необходимости подтверждения регистрации
    // помимо этого можно реализовать функционал смены пароля
    const { userName, email, password, passwordConfirmation } = command.dto;

    if (password !== passwordConfirmation)
      throw new BadRequestException(
        'password and passwordConfirmation must be identical',
      );

    const extendedUserByEmail = await this.userRepository.getUserByField({
      field: UserFields.Email,
      value: email,
    });

    if (extendedUserByEmail)
      throw new BadRequestException('user with this email already exists');

    const extendedUserByUserName = await this.userRepository.getUserByField({
      field: UserFields.UserName,
      value: userName,
    });

    if (extendedUserByUserName)
      throw new BadRequestException('user with this userName already exists');

    const passwordHash = await bcrypt.hash(password, SALT_OR_ROUNDS);

    const user: UserEntity = UserEntity.createUser({
      userName,
      email,
      passwordHash,
    });

    return await this.userRepository.saveUser(user);
  }
}
