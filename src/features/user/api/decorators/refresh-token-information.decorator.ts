import { ExecutionContext, createParamDecorator } from '@nestjs/common';

// декоратор для обработки refresh token текущего пользователя
export const RefreshTokenInformation = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    return {
      userId: request.user.userId,
      deviceId: request.user.deviceId,
    };
  },
);
