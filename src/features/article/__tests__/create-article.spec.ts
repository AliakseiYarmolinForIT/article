import { Test, TestingModule } from '@nestjs/testing';
import { EventBus } from '@nestjs/cqrs';
import {
  CreateArticleCommand,
  CreateArticleUseCase,
} from '../application/use-cases/create-article.use-case';
import { ArticleRepository } from '../infrastructure/repositories/article.repository';
import { InvalidateArticlesCacheEvent } from '../application/event-handlers/invalidate-articles-cache.event-handler';

describe('CreateArticleUseCase', () => {
  let createArticleUseCase: CreateArticleUseCase;
  let articleRepository: ArticleRepository;
  let eventBus: EventBus;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateArticleUseCase,
        {
          provide: ArticleRepository,
          useValue: {
            saveArticle: jest.fn(), // создание заглушки
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

    createArticleUseCase =
      module.get<CreateArticleUseCase>(CreateArticleUseCase);
    articleRepository = module.get<ArticleRepository>(ArticleRepository);
    eventBus = module.get<EventBus>(EventBus);
  });

  it('should create an article and publish an event', async () => {
    const userId = '1';
    const title = 'Test title';
    const description = 'Test description.';

    const command = new CreateArticleCommand({
      userId,
      title,
      description,
    });

    const savingArticleResult = {
      id: '1',
    };
    jest
      .spyOn(articleRepository, 'saveArticle')
      .mockResolvedValue(savingArticleResult);

    const result = await createArticleUseCase.execute(command);

    expect(articleRepository.saveArticle).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: Number(userId),
        title,
        description,
      }),
    );

    expect(eventBus.publish).toHaveBeenCalledWith(
      expect.any(InvalidateArticlesCacheEvent),
    );

    expect(result).toEqual(savingArticleResult);
  });
});
