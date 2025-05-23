import { ApiProperty } from '@nestjs/swagger';

export class ArticleViewModel {
  @ApiProperty({
    description: 'Id статьи',
    example: '777',
  })
  public id: string;

  @ApiProperty({
    description: 'Имя автора статьи',
    example: 'Toretto',
  })
  public userName: string;

  @ApiProperty({
    description: 'Название статьи',
    example: 'My first article',
  })
  public title: string;

  @ApiProperty({
    description: 'Описание статьи',
    example: 'Hello. This article is about my hobby.',
  })
  public description: string;

  @ApiProperty({
    description: 'Дата создания',
    example: '2025-02-24 15:22:03.998763+00',
  })
  public createdAt: Date;
}
