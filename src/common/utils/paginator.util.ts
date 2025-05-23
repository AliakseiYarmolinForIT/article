// утилита для добавления пагинационных данных
import { ApiProperty } from '@nestjs/swagger';

export class Paginator<T> {
  @ApiProperty({
    isArray: true,
  })
  public items: T;

  @ApiProperty({
    description: 'Общее количество найденных записей',
  })
  public count: number;

  @ApiProperty({
    description: 'Номер страницы',
  })
  public page: number;

  @ApiProperty({
    description: 'Размер страницы',
  })
  public pageSize: number;

  @ApiProperty({
    description:
      'Индикатор последней страницы: true - текуцщая страница последняя, false - текуцщая страница не последняя',
  })
  public lastPage: boolean;

  public constructor(data: T, count: number, page: number, pageSize: number) {
    this.items = data;
    this.count = count;
    this.page = page;
    this.pageSize = pageSize;
    this.lastPage = Math.ceil(count / pageSize) <= page;
  }
}
