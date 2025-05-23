import { Strategy } from 'passport-local';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { UserRepository } from 'src/features/user/infrastructure/repositories/user.repository';
import * as bcrypt from 'bcrypt';
import { UserFields } from 'src/features/user/common/enums/user-fields.enum';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  public constructor(private readonly userRepository: UserRepository) {
    super({
      usernameField: 'email', // замена ключа в body с 'username' на 'email'
    });
  }

  public async validate(email: string, password: string) {
    const user = await this.userRepository.getUserByField({
      field: UserFields.Email,
      value: email,
    });

    if (!user) {
      throw new UnauthorizedException('incorrect email');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      throw new UnauthorizedException('incorrect password');
    }

    return { userId: String(user.id) };
  }
}
