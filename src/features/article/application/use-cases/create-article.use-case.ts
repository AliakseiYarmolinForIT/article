import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { IdDto } from 'src/common/types/id.type';
import { ArticleEntity } from '../../domain/entities/article.entity';
import { ArticleRepository } from '../../infrastructure/repositories/article.repository';
import { InvalidateArticlesCacheEvent } from '../event-handlers/invalidate-articles-cache.event-handler';

export class CreateArticleCommand {
  public constructor(
    public dto: {
      userId: string;
      title: string;
      description: string;
    },
  ) {}
}

@CommandHandler(CreateArticleCommand)
export class CreateArticleUseCase
  implements ICommandHandler<CreateArticleCommand>
{
  public constructor(
    private readonly eventBus: EventBus,
    private readonly articleRepository: ArticleRepository,
  ) {}

  public async execute(command: CreateArticleCommand): Promise<IdDto> {
    const { userId, title, description } = command.dto;

    const article = ArticleEntity.createArticle({ userId, title, description });

    // при необходимости можно добавить проверку на наличие имеющегося title у текущего user

    const result = await this.articleRepository.saveArticle(article);

    await this.eventBus.publish(new InvalidateArticlesCacheEvent());

    return result;
  }
}
