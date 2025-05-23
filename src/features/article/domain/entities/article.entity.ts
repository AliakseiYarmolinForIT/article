import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../../common/abstractions/base.entity';
import { UserEntity } from '../../../user/domain/entities/user.entity';

@Entity()
export class ArticleEntity extends BaseEntity {
  @Column()
  public title: string;

  @Column()
  public description: string;

  @Column({ type: 'integer' })
  public userId: number;

  @ManyToOne(() => UserEntity, (user) => user.articles)
  public user: UserEntity;

  public static createArticle({
    userId,
    title,
    description,
  }: {
    userId: string;
    title: string;
    description: string;
  }) {
    const article = new ArticleEntity();

    article.userId = Number(userId);
    article.title = title;
    article.description = description;

    return article;
  }

  public updateArticle({
    title,
    description,
  }: {
    title: string;
    description: string;
  }) {
    this.title = title;
    this.description = description;
  }

  // при удалении применяется soft delete. при необходимости удалённую запись всегда можно восстановить
  public deleteArticle() {
    this.deletedAt = new Date();
  }
}
