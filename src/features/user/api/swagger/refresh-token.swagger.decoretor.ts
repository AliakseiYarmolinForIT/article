import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { AccessTokenViewModel } from '../view-models/access-token.view-model';
import { ErrorResponseViewModel } from 'src/common/view-models/error-response.vies-model';

export function RefreshTokenSwagger() {
  return applyDecorators(
    ApiOperation({ summary: 'Refresh token' }),
    ApiCookieAuth(),
    ApiExtraModels(AccessTokenViewModel),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Success',
      schema: {
        $ref: getSchemaPath(AccessTokenViewModel),
      },
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized',
      type: ErrorResponseViewModel,
    }),
  );
}
