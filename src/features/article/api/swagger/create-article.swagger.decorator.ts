import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { ErrorResponseViewModel } from 'src/common/view-models/error-response.vies-model';
import { IdViewModel } from 'src/common/view-models/id.view-model';

export function CreateArticleSwagger() {
  return applyDecorators(
    ApiOperation({ summary: 'Create article' }),
    ApiBearerAuth(),
    ApiExtraModels(IdViewModel),
    ApiResponse({
      status: HttpStatus.CREATED,
      description: 'Success',
      schema: {
        $ref: getSchemaPath(IdViewModel),
      },
    }),
    ApiBadRequestResponse({
      description: 'Bad request',
      type: ErrorResponseViewModel,
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized',
      type: ErrorResponseViewModel,
    }),
  );
}
