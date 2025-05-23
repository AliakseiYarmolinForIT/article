// маппер для преобразования user в CurrentUserViewModel
import { Injectable } from '@nestjs/common';
import { UserEntity } from '../../domain/entities/user.entity';
import { CurrentUserViewModel } from '../view-models/current-user.view-model';

@Injectable()
export class UserMapper {
  public toCurrentUsersViewModel(user: UserEntity): CurrentUserViewModel {
    return {
      id: user.id.toString(),
      userName: user.userName,
      email: user.email,
    };
  }
}
