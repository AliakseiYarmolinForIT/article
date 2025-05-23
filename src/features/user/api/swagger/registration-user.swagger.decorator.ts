import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { ErrorResponseViewModel } from 'src/common/view-models/error-response.vies-model';
import { IdViewModel } from 'src/common/view-models/id.view-model';

export function RegistrationUserSwagger() {
  return applyDecorators(
    ApiOperation({ summary: 'Registration user' }),
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
  );
}
