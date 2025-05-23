import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IdDto } from 'src/common/types/id.type';
import { ArticleEntity } from '../../domain/entities/article.entity';

@Injectable()
export class ArticleRepository {
  public constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
  ) {}

  public async getArticleById({
    articleId,
  }: {
    articleId: string;
  }): Promise<ArticleEntity | null> {
    return await this.articleRepository.findOne({
      where: { id: Number(articleId) },
    });
  }

  public async saveArticle(article: ArticleEntity): Promise<IdDto> {
    const creationResult = await this.articleRepository.save(article);

    return { id: String(creationResult.id) };
  }
}
