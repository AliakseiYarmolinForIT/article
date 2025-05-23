import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { ArticleRepository } from '../../infrastructure/repositories/article.repository';
import { InvalidateArticlesCacheEvent } from '../event-handlers/invalidate-articles-cache.event-handler';

export class DeleteArticleCommand {
  public constructor(
    public dto: {
      articleId: string;
      userId: string;
    },
  ) {}
}

@CommandHandler(DeleteArticleCommand)
export class DeleteArticleUseCase
  implements ICommandHandler<DeleteArticleCommand>
{
  public constructor(
    private readonly eventBus: EventBus,
    private readonly articleRepository: ArticleRepository,
  ) {}

  public async execute(command: DeleteArticleCommand): Promise<void> {
    const { articleId, userId } = command.dto;

    const article = await this.articleRepository.getArticleById({ articleId });

    if (!article) {
      throw new NotFoundException('article not found');
    }

    if (article.userId !== Number(userId)) {
      throw new ForbiddenException(
        'article deletion is restricted to the author',
      );
    }

    article.deleteArticle();

    await this.articleRepository.saveArticle(article);

    await this.eventBus.publish(new InvalidateArticlesCacheEvent());
  }
}
