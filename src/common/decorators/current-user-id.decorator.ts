import { ExecutionContext, createParamDecorator } from '@nestjs/common';

// декоратор для получения id текущего пользователя
export const CurrentUserId = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    return { userId: request.user.userId as string };
  },
);
