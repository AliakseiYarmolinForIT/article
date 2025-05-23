import { CommandBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { IdDto } from 'src/common/types/id.type';
import { CurrentUserId } from 'src/common/decorators/current-user-id.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt.auth.guard';
import { ArticleMapper } from '../mappers/article.mapper';
import { ArticleQueryRepository } from '../../infrastructure/repositories/article-query.repository';
import { ArticleViewModel } from '../view-models/article.view-model';
import { CreateArticleDto } from '../dto/create-article.dto';
import { IdViewModel } from 'src/common/view-models/id.view-model';
import { CreateArticleCommand } from '../../application/use-cases/create-article.use-case';
import { UpdateArticleCommand } from '../../application/use-cases/update-article.use-case';
import { DeleteArticleCommand } from '../../application/use-cases/delete-article.use-case';
import { GetArticlesPaginationDto } from '../dto/get-articles.pagination.dto';
import { Paginator } from 'src/common/utils/paginator.util';
import { CreateArticleSwagger } from '../swagger/create-article.swagger.decorator';
import { UpdateArticleSwagger } from '../swagger/update-article.swagger.decorator';
import { DeleteArticleSwagger } from '../swagger/delete-article.swagger.decorator';
import { GetArticlesSwagger } from '../swagger/get-articles.swagger.decorator';
import { GetArticleSwagger } from '../swagger/get-article.swagger.decorator';

@ApiTags('Article')
@Controller('article')
export class ArticleController {
  public constructor(
    private readonly commandBus: CommandBus,
    private readonly articleMapper: ArticleMapper,
    private readonly articleRepository: ArticleQueryRepository,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  @GetArticlesSwagger()
  public async getArticles(
    @Query() query: GetArticlesPaginationDto,
  ): Promise<Paginator<ArticleViewModel[]>> {
    const { articles, articlesCount } =
      await this.articleRepository.getArticles(query);

    const mappedArticles = articles.map((article) =>
      this.articleMapper.toArticleViewModel(article),
    );

    return new Paginator(
      mappedArticles,
      articlesCount,
      query.pageNumber,
      query.pageSize,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  @GetArticleSwagger()
  public async getArticle(
    @Param('id', ParseIntPipe) articleId: string,
  ): Promise<ArticleViewModel> {
    const article = await this.articleRepository.getArticleById({
      articleId,
    });

    if (!article) throw new NotFoundException('article not found');

    return this.articleMapper.toArticleViewModel(article);
  }

  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  @Post()
  @CreateArticleSwagger()
  public async createArticle(
    @CurrentUserId() userInfo: { userId: string },
    @Body() inputModel: CreateArticleDto,
  ): Promise<IdViewModel> {
    return await this.commandBus.execute<CreateArticleCommand, IdDto>(
      new CreateArticleCommand({ ...inputModel, userId: userInfo.userId }),
    );
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @UpdateArticleSwagger()
  public async updateArticle(
    @Param('id', ParseIntPipe) articleId: string,
    @CurrentUserId() userInfo: { userId: string },
    @Body() inputModel: CreateArticleDto,
  ): Promise<void> {
    await this.commandBus.execute<UpdateArticleCommand, void>(
      new UpdateArticleCommand({
        ...inputModel,
        articleId,
        userId: userInfo.userId,
      }),
    );

    return;
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @DeleteArticleSwagger()
  public async deleteArticle(
    @Param('id', ParseIntPipe) articleId: string,
    @CurrentUserId() userInfo: { userId: string },
  ): Promise<void> {
    await this.commandBus.execute<DeleteArticleCommand, void>(
      new DeleteArticleCommand({ articleId, userId: userInfo.userId }),
    );

    return;
  }
}
