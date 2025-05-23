import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { ArticleController } from './api/controllers/article.controller';
import { JwtAuthStrategy } from 'src/common/strategies/jwt.auth.strategy';
import { CreateArticleUseCase } from './application/use-cases/create-article.use-case';
import { UpdateArticleUseCase } from './application/use-cases/update-article.use-case';
import { DeleteArticleUseCase } from './application/use-cases/delete-article.use-case';
import { ArticleRepository } from './infrastructure/repositories/article.repository';
import { ArticleQueryRepository } from './infrastructure/repositories/article-query.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleEntity } from './domain/entities/article.entity';
import { ArticleMapper } from './api/mappers/article.mapper';
import { InvalidateArticlesCacheHandler } from './application/event-handlers/invalidate-articles-cache.event-handler';

const useCases = [
  CreateArticleUseCase,
  UpdateArticleUseCase,
  DeleteArticleUseCase,
];

const repositories = [ArticleQueryRepository, ArticleRepository];

@Module({
  imports: [
    CqrsModule,
    JwtModule.register({}),
    TypeOrmModule.forFeature([ArticleEntity]),
  ],
  controllers: [ArticleController],
  providers: [
    JwtAuthStrategy,
    ArticleMapper,
    InvalidateArticlesCacheHandler,
    ...useCases,
    ...repositories,
  ],
})
export class ArticleModule {}
