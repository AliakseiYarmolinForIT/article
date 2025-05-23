import { Controller, Get, HttpStatus } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
  public constructor(@InjectRedis() private readonly redisClient: Redis) {}

  // вспомогательный endpoint для проверки работы приложения
  @ApiOperation({ summary: 'Health check for app' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    content: {
      'application/json': {
        schema: {
          type: 'string',
          example: 'Ok!',
        },
      },
    },
  })
  @Get('app')
  public checkApp() {
    return 'Ok!';
  }

  // вспомогательный endpoint для проверки работы redis
  @ApiOperation({ summary: 'Health check for redis' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    content: {
      'application/json': {
        schema: {
          type: 'string',
          example: 'Ok!',
        },
      },
    },
  })
  @Get('redis')
  public async checkRedis(): Promise<string | null> {
    await this.redisClient.set('test', 'Ok!');

    return await this.redisClient.get('test');
  }
}
