import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorResponse } from '../types/error-response.type';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const responseBody: ErrorResponse = {
      statusCode: 500,
      errorsMessages: [
        {
          message: exception.message || 'Internal server error',
          field: '',
        },
      ],
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    response.status(500).json(responseBody);
  }
}
