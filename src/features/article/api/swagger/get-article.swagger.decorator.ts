import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { ArticleViewModel } from '../view-models/article.view-model';
import { ErrorResponseViewModel } from 'src/common/view-models/error-response.vies-model';

export function GetArticleSwagger() {
  return applyDecorators(
    ApiOperation({ summary: 'Get article' }),
    ApiExtraModels(ArticleViewModel),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Success',
      schema: {
        $ref: getSchemaPath(ArticleViewModel),
      },
    }),
    ApiNotFoundResponse({
      description: 'Not found',
      type: ErrorResponseViewModel,
    }),
  );
}
