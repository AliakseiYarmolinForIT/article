import {
  BadRequestException,
  INestApplication,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { ValidationPipeError } from 'src/common/types/validation-pipe-error.type';

export function pipesSetup(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      // создание экземпляра dto + применение значений по-умолчанию
      transform: true,
      // обрезка значений, отсутствующих в dto
      whitelist: true,
      // выведение первой ошибки для каждого поля
      stopAtFirstError: true,
      // обработка ошибок валидации
      exceptionFactory: (errors: ValidationError[]) => {
        const errorsForResponse: ValidationPipeError[] = errors.flatMap(
          (error) => {
            const constraints = error.constraints ?? {};
            return Object.entries(constraints).map(
              ([, value]): ValidationPipeError => ({
                field: error.property,
                message: value,
              }),
            );
          },
        );
        throw new BadRequestException(errorsForResponse);
      },
    }),
  );
}
