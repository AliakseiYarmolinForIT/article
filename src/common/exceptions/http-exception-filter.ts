import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorResponse } from '../types/error-response.type';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const errorsMessages = this.getErrorMessages(exceptionResponse);

    const responseBody: ErrorResponse = {
      statusCode: status,
      errorsMessages,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    response.status(status).json(responseBody);
  }

  private getErrorMessages(exceptionResponse: any) {
    // Обработка ошибок валидации из ValidationPipe
    if (Array.isArray(exceptionResponse)) {
      return exceptionResponse.map((error) => ({
        message: error.message || 'Validation error',
        field: error.field || '',
      }));
    }

    // Обработка стандартных HttpException
    const message =
      typeof exceptionResponse === 'string'
        ? exceptionResponse
        : exceptionResponse.message || 'Something went wrong';

    return [{ message, field: '' }];
  }
}
