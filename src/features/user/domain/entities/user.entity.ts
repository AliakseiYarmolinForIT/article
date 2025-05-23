import { Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { SessionEntity } from './session.entity';
import { ArticleEntity } from '../../../article/domain/entities/article.entity';
import { BaseEntity } from '../../../../common/abstractions/base.entity';

@Entity()
export class UserEntity extends BaseEntity {
  @Column()
  public userName: string;

  @Column()
  public email: string;

  @Column()
  public passwordHash: string;

  @OneToOne(() => SessionEntity, (userSession) => userSession.userEntity)
  public userSession: SessionEntity;

  @OneToMany(() => ArticleEntity, (article) => article.user)
  public articles: ArticleEntity[];

  public static createUser({
    userName,
    email,
    passwordHash,
  }: {
    userName: string;
    email: string;
    passwordHash: string;
  }) {
    const user = new UserEntity();

    user.userName = userName;
    user.email = email;
    user.passwordHash = passwordHash;

    return user;
  }
}
