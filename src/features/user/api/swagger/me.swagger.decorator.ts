import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { CurrentUserViewModel } from '../view-models/current-user.view-model';
import { ErrorResponseViewModel } from 'src/common/view-models/error-response.vies-model';

export function MeSwagger() {
  return applyDecorators(
    ApiOperation({ summary: 'Get information about current user' }),
    ApiBearerAuth(),
    ApiExtraModels(CurrentUserViewModel),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Success',
      schema: {
        $ref: getSchemaPath(CurrentUserViewModel),
      },
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized',
      type: ErrorResponseViewModel,
    }),
  );
}
