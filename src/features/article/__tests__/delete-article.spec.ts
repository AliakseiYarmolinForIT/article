import { Test, TestingModule } from '@nestjs/testing';
import { EventBus } from '@nestjs/cqrs';
import { ArticleRepository } from '../infrastructure/repositories/article.repository';
import { ArticleEntity } from '../domain/entities/article.entity';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { InvalidateArticlesCacheEvent } from '../application/event-handlers/invalidate-articles-cache.event-handler';
import {
  DeleteArticleCommand,
  DeleteArticleUseCase,
} from '../application/use-cases/delete-article.use-case';

describe('DeleteArticleUseCase', () => {
  let deleteArticleUseCase: DeleteArticleUseCase;
  let articleRepository: ArticleRepository;
  let eventBus: EventBus;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteArticleUseCase,
        {
          provide: ArticleRepository,
          useValue: {
            saveArticle: jest.fn(), // создание заглушки
            getArticleById: jest.fn(), // создание заглушки
          },
        },
        {
          provide: EventBus,
          useValue: {
            publish: jest.fn(), // создание заглушки
          },
        },
      ],
    }).compile();

    deleteArticleUseCase =
      module.get<DeleteArticleUseCase>(DeleteArticleUseCase);
    articleRepository = module.get<ArticleRepository>(ArticleRepository);
    eventBus = module.get<EventBus>(EventBus);
  });

  it('should not delete an article and throw NotFoundException', async () => {
    const articleId = '1';

    const command = new DeleteArticleCommand({
      articleId,
      userId: '1',
    });

    const searchArticleResult: ArticleEntity | null = null;
    jest
      .spyOn(articleRepository, 'getArticleById')
      .mockResolvedValue(searchArticleResult);

    await expect(deleteArticleUseCase.execute(command)).rejects.toThrow(
      NotFoundException,
    );

    expect(articleRepository.getArticleById).toHaveBeenCalledWith({
      articleId,
    });
  });

  it('should not delete an article and throw ForbiddenException', async () => {
    const articleId = '1';
    const userId = '1';

    const command = new DeleteArticleCommand({
      articleId,
      userId,
    });

    const searchArticleResult: ArticleEntity | null = {
      id: Number(articleId),
      title: 'Test title',
      description: 'Test description.',
      userId: 2,
    } as unknown as ArticleEntity;
    jest
      .spyOn(articleRepository, 'getArticleById')
      .mockResolvedValue(searchArticleResult);

    await expect(deleteArticleUseCase.execute(command)).rejects.toThrow(
      ForbiddenException,
    );

    expect(articleRepository.getArticleById).toHaveBeenCalledWith({
      articleId,
    });
  });

  it('should delete an article and publish an event', async () => {
    const articleId = '1';
    const userId = '1';

    const command = new DeleteArticleCommand({
      articleId,
      userId,
    });

    const searchArticleResult = new ArticleEntity();
    searchArticleResult.id = Number(articleId);
    searchArticleResult.userId = Number(userId);
    searchArticleResult.title = 'Test title';
    searchArticleResult.description = 'Test description.';
    jest
      .spyOn(articleRepository, 'getArticleById')
      .mockResolvedValue(searchArticleResult);

    await deleteArticleUseCase.execute(command);

    expect(articleRepository.saveArticle).toHaveBeenCalledWith(
      expect.objectContaining({
        id: Number(articleId),
        userId: Number(userId),
        title: searchArticleResult.title,
        description: searchArticleResult.description,
      }),
    );

    expect(eventBus.publish).toHaveBeenCalledWith(
      expect.any(InvalidateArticlesCacheEvent),
    );
  });
});
