import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { GLOBAL_PREFIX } from './global-prefix.setup';

export function swaggerSetup(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('ARTICLE API DOCUMENTATION')
    .addBearerAuth()
    .setVersion('1.0')
    .addCookieAuth('refreshToken', {
      type: 'apiKey',
      in: 'cookie',
      description: 'Refresh token для получения новой пары токенов',
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${GLOBAL_PREFIX}/swagger`, app, document, {
    customSiteTitle: 'Article Swagger',
  });
}
