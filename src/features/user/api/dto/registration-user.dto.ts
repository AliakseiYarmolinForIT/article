import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Trim } from 'src/common/decorators/trim-validation.decorator';
import {
  MIN_USER_NAME_LENGTH,
  MAX_USER_NAME_LENGTH,
  MIN_PASSWORD_LENGTH,
  MAX_PASSWORD_LENGTH,
} from '../../common/constants/constants';

export class RegistrationUserDto {
  @ApiProperty({
    type: String,
    description: 'Имя пользователя',
    example: 'Toretto',
  })
  @IsString()
  @Trim()
  @Length(MIN_USER_NAME_LENGTH, MAX_USER_NAME_LENGTH)
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9_-]+$/)
  public userName: string;

  @ApiProperty({
    type: String,
    description: 'Email пользователя',
    example: 'toretto@gmail.com',
  })
  @IsString()
  @Trim()
  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @ApiProperty({
    type: String,
    description: 'Пароль пользователя',
    example: 'Toretto777',
  })
  @IsString()
  @Trim()
  @Length(MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH)
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9_-]+$/)
  public password: string;

  @ApiProperty({
    type: String,
    description: 'Подтверждение пароля пользователя',
    example: 'Toretto777',
  })
  @IsString()
  @Trim()
  @Length(MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH)
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9_-]+$/)
  public passwordConfirmation: string;
}
