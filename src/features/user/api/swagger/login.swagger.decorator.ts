import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { AccessTokenViewModel } from '../view-models/access-token.view-model';
import { LoginUserDto } from '../dto/login-user.dto';
import { ErrorResponseViewModel } from 'src/common/view-models/error-response.vies-model';

export function LoginUserSwagger() {
  return applyDecorators(
    ApiOperation({ summary: 'Login user' }),
    ApiBody({ type: LoginUserDto }),
    ApiExtraModels(AccessTokenViewModel),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Success',
      schema: {
        $ref: getSchemaPath(AccessTokenViewModel),
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
