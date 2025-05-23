import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorResponseViewModel } from '../view-models/error-response.vies-model';

// ExceptionFilter для http ошибок
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  public catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const errorsMessages = this.getErrorMessages(exceptionResponse);

    const responseBody: ErrorResponseViewModel = {
      statusCode: status,
      errorsMessages,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    response.status(status).json(responseBody);
  }

  private getErrorMessages(exceptionResponse: any) {
    // обработка ошибок валидации из ValidationPipe
    if (Array.isArray(exceptionResponse)) {
      return exceptionResponse.map((error) => ({
        message: error.message || 'Validation error',
        field: error.field || '',
      }));
    }

    // обработка стандартных HttpException
    const message =
      typeof exceptionResponse === 'string'
        ? exceptionResponse
        : exceptionResponse.message || 'Something went wrong';

    return [{ message, field: '' }];
  }
}
