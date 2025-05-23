// маппер для преобразования article в ArticleViewModel
import { Injectable } from '@nestjs/common';
import { GetArticleDto } from '../../common/types/get-article.dto';
import { ArticleViewModel } from '../view-models/article.view-model';

@Injectable()
export class ArticleMapper {
  public toArticleViewModel(article: GetArticleDto): ArticleViewModel {
    return {
      id: article.id.toString(),
      title: article.title,
      description: article.description,
      userName: article.userName,
      createdAt: article.createdAt,
    };
  }
}
