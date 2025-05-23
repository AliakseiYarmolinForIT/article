import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Trim } from 'src/common/decorators/trim-validation.decorator';
import {
  MIN_ARTICLE_TITLE_LENGTH,
  MAX_ARTICLE_TITLE_LENGTH,
  MIN_ARTICLE_DESCRIPTION_LENGTH,
  MAX_ARTICLE_DESCRIPTION_LENGTH,
} from '../../common/constants/constants';

export class CreateArticleDto {
  @ApiProperty({
    type: String,
    description: 'Название статьи',
    example: 'My first article',
  })
  @IsString()
  @Trim()
  @Length(MIN_ARTICLE_TITLE_LENGTH, MAX_ARTICLE_TITLE_LENGTH)
  @IsNotEmpty()
  public title: string;

  @ApiProperty({
    type: String,
    description: 'Описание статьи',
    example: 'Hello. This article is about my hobby.',
  })
  @IsString()
  @Trim()
  @Length(MIN_ARTICLE_DESCRIPTION_LENGTH, MAX_ARTICLE_DESCRIPTION_LENGTH)
  @IsNotEmpty()
  public description: string;
}
