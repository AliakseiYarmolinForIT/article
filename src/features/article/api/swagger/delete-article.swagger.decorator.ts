import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ErrorResponseViewModel } from 'src/common/view-models/error-response.vies-model';

export function DeleteArticleSwagger() {
  return applyDecorators(
    ApiOperation({ summary: 'Delete article' }),
    ApiBearerAuth(),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: 'Success',
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized',
      type: ErrorResponseViewModel,
    }),
    ApiForbiddenResponse({
      description: 'Forbidden',
      type: ErrorResponseViewModel,
    }),
    ApiNotFoundResponse({
      description: 'Not found',
      type: ErrorResponseViewModel,
    }),
  );
}
