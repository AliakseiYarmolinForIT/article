import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ErrorResponseViewModel } from 'src/common/view-models/error-response.vies-model';

export function UpdateArticleSwagger() {
  return applyDecorators(
    ApiOperation({ summary: 'Update article' }),
    ApiBearerAuth(),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: 'Success',
    }),
    ApiBadRequestResponse({
      description: 'Bad request',
      type: ErrorResponseViewModel,
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
