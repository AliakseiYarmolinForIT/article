import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { Paginator } from 'src/common/utils/paginator.util';
import { ArticleViewModel } from '../view-models/article.view-model';

export function GetArticlesSwagger() {
  return applyDecorators(
    ApiOperation({ summary: 'Get articles' }),
    ApiExtraModels(ArticleViewModel, Paginator),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Success',
      schema: {
        allOf: [
          { $ref: getSchemaPath(Paginator) },
          {
            properties: {
              items: {
                $ref: getSchemaPath(ArticleViewModel),
              },
            },
          },
        ],
      },
    }),
  );
}
