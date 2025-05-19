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
      // Создание экземпляра dto + применение значений по-умолчанию
      transform: true,
      // Обрезка значений, отсутствующих в dto
      whitelist: true,
      // Выведение первой ошибки для каждого поля
      stopAtFirstError: true,
      // Обработка ошибок валидации
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
