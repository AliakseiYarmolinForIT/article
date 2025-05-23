import { Test, TestingModule } from '@nestjs/testing';
import { EventBus } from '@nestjs/cqrs';
import { ArticleRepository } from '../infrastructure/repositories/article.repository';
import {
  UpdateArticleCommand,
  UpdateArticleUseCase,
} from '../application/use-cases/update-article.use-case';
import { ArticleEntity } from '../domain/entities/article.entity';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { InvalidateArticlesCacheEvent } from '../application/event-handlers/invalidate-articles-cache.event-handler';

describe('UpdateArticleUseCase', () => {
  let updateArticleUseCase: UpdateArticleUseCase;
  let articleRepository: ArticleRepository;
  let eventBus: EventBus;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateArticleUseCase,
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

    updateArticleUseCase =
      module.get<UpdateArticleUseCase>(UpdateArticleUseCase);
    articleRepository = module.get<ArticleRepository>(ArticleRepository);
    eventBus = module.get<EventBus>(EventBus);
  });

  it('should not update an article and throw NotFoundException', async () => {
    const articleId = '1';

    const command = new UpdateArticleCommand({
      articleId,
      userId: '1',
      title: 'Test new title',
      description: 'Test new description.',
    });

    const searchArticleResult: ArticleEntity | null = null;
    jest
      .spyOn(articleRepository, 'getArticleById')
      .mockResolvedValue(searchArticleResult);

    await expect(updateArticleUseCase.execute(command)).rejects.toThrow(
      NotFoundException,
    );

    expect(articleRepository.getArticleById).toHaveBeenCalledWith({
      articleId,
    });
  });

  it('should not update an article and throw ForbiddenException', async () => {
    const articleId = '1';

    const command = new UpdateArticleCommand({
      articleId,
      userId: '1',
      title: 'Test new title',
      description: 'Test new description.',
    });

    const searchArticleResult: ArticleEntity | null = {
      id: 1,
      title: 'Test title',
      description: 'Test description.',
      userId: 2,
    } as unknown as ArticleEntity;
    jest
      .spyOn(articleRepository, 'getArticleById')
      .mockResolvedValue(searchArticleResult);

    await expect(updateArticleUseCase.execute(command)).rejects.toThrow(
      ForbiddenException,
    );

    expect(articleRepository.getArticleById).toHaveBeenCalledWith({
      articleId,
    });
  });

  it('should update an article and publish an event', async () => {
    const articleId = '1';
    const userId = '1';
    const title = 'Test new title';
    const description = 'Test new description.';

    const command = new UpdateArticleCommand({
      articleId,
      userId,
      title,
      description,
    });

    const searchArticleResult = new ArticleEntity();
    searchArticleResult.id = Number(articleId);
    searchArticleResult.userId = Number(userId);
    searchArticleResult.title = 'Test title';
    searchArticleResult.description = 'Test description.';
    jest
      .spyOn(articleRepository, 'getArticleById')
      .mockResolvedValue(searchArticleResult);

    await updateArticleUseCase.execute(command);

    expect(articleRepository.saveArticle).toHaveBeenCalledWith(
      expect.objectContaining({
        id: Number(articleId),
        userId: Number(userId),
        title,
        description,
      }),
    );

    expect(eventBus.publish).toHaveBeenCalledWith(
      expect.any(InvalidateArticlesCacheEvent),
    );
  });
});
