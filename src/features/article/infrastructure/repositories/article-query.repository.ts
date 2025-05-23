import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArticleEntity } from '../../domain/entities/article.entity';
import { GetArticlesPaginationDto } from '../../api/dto/get-articles.pagination.dto';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';
import { GetArticleDto } from '../../common/types/get-article.dto';

@Injectable()
export class ArticleQueryRepository {
  public constructor(
    @InjectRedis() private readonly redisClient: Redis,
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
  ) {}

  public async getArticleById({
    articleId,
  }: {
    articleId: string;
  }): Promise<GetArticleDto | null> {
    const article: GetArticleDto | undefined = await this.articleRepository
      .createQueryBuilder('article')
      .leftJoin('article.user', 'user')
      .select([
        'article.id as id',
        'article.title as title',
        'article.description as description',
        'article.createdAt as "createdAt"', // кавычки необходимы для сохранения регистра в createdAt
        'user.userName as "userName"', // кавычки необходимы для сохранения регистра userName
      ])
      .where('article.id = :articleId', { articleId: Number(articleId) })
      .andWhere('article.deletedAt IS NULL') // дополнительная явная проверка на то, что запрашиваемый article не удалён
      .getRawOne();

    return article ? article : null;
  }

  public async getArticles(
    filter: GetArticlesPaginationDto,
  ): Promise<{ articles: GetArticleDto[]; articlesCount: number }> {
    const cacheKey = `articles:${JSON.stringify(filter)}`;
    const cachedData = await this.redisClient.get(cacheKey);

    if (cachedData) {
      return JSON.parse(cachedData) as {
        articles: GetArticleDto[];
        articlesCount: number;
      };
    }

    const query = this.articleRepository
      .createQueryBuilder('article')
      .leftJoin('article.user', 'user')
      .select([
        'article.id as id',
        'article.title as title',
        'article.description as description',
        'article.createdAt as "createdAt"', // кавычки необходимы для сохранения регистра createdAt
        'user.userName as "userName"', // кавычки необходимы для сохранения регистра userName
      ])
      .where('article.deletedAt IS NULL'); // дополнительная явная проверка необходимая для того, чтобы в результат не попали удалённые articles

    if (filter.searchTitleTerm) {
      query.andWhere('article.title ILIKE :searchTitleTerm', {
        searchTitleTerm: filter.searchTitleTerm,
      });
    }

    if (filter.searchUserId) {
      query.andWhere('article.userId = :searchUserId', {
        searchUserId: filter.searchUserId,
      });
    }

    const articlesCount = await query.getCount();

    query
      .orderBy(`article.${filter.sortBy}`, filter.sortDirection)
      .offset((filter.pageNumber - 1) * filter.pageSize)
      .limit(filter.pageSize);

    const articles = await query.getRawMany();

    const result = { articles, articlesCount };

    // т.к. в ТЗ не указана необходимость ограничения времени хранения записей, применён метод .set
    // при необходимости ограничения времени хранения записей необходимо применить метод .setex(cacheKey, seconds, JSON.stringify(result)), в котором seconds - количетво секунд хранения записи
    await this.redisClient.set(cacheKey, JSON.stringify(result));

    return result;
  }
}
