import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../domain/entities/user.entity';
import { IdDto } from 'src/common/types/id.type';
import { UserFields } from '../../common/enums/user-fields.enum';

@Injectable()
export class UserRepository {
  public constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  public async getUserByField({
    field,
    value,
  }: {
    field: UserFields;
    value: string;
  }): Promise<UserEntity | null> {
    return await this.userRepository.findOne({
      where: { [field]: value },
    });
  }

  public async saveUser(user: UserEntity): Promise<IdDto> {
    const creationResult = await this.userRepository.save(user);

    return { id: String(creationResult.id) };
  }
}
