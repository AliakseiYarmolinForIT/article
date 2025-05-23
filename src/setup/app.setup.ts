import cookieParser from 'cookie-parser';
import { INestApplication } from '@nestjs/common';
import { pipesSetup } from './pipes.setup';
import { globalPrefixSetup } from './global-prefix.setup';
import { swaggerSetup } from './swagger.setup';
import { GlobalExceptionFilter } from 'src/common/exceptions/global-exception-filter';
import { HttpExceptionFilter } from 'src/common/exceptions/http-exception-filter';

export function appSetup(app: INestApplication) {
  app.use(cookieParser());
  app.enableCors({
    origin: true,
    credentials: true,
  });
  app.useGlobalFilters(new GlobalExceptionFilter(), new HttpExceptionFilter());
  pipesSetup(app);
  globalPrefixSetup(app);
  swaggerSetup(app);
}
