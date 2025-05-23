import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ErrorResponseViewModel } from 'src/common/view-models/error-response.vies-model';

export function LogoutUserSwagger() {
  return applyDecorators(
    ApiOperation({ summary: 'Logout user' }),
    ApiCookieAuth(),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: 'Success',
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized',
      type: ErrorResponseViewModel,
    }),
  );
}
