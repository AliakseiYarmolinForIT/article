import { Transform, TransformFnParams } from 'class-transformer';

// декоратор для удаления пробелов
export const Trim = (): PropertyDecorator =>
  Transform(({ value }: TransformFnParams) => {
    if (typeof value !== 'string') {
      return;
    }
    return value.trim();
  });
