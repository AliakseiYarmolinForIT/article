import { InjectRedis } from '@nestjs-modules/ioredis';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Redis } from 'ioredis';

export class InvalidateArticlesCacheEvent {
  public constructor() {}
}

@EventsHandler(InvalidateArticlesCacheEvent)
export class InvalidateArticlesCacheHandler
  implements IEventHandler<InvalidateArticlesCacheEvent>
{
  public constructor(@InjectRedis() private readonly redis: Redis) {}

  public async handle() {
    const keys = await this.redis.keys('articles:*');

    if (keys.length) {
      await this.redis.del(...keys);
    }
  }
}
