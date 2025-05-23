import { ApiProperty } from '@nestjs/swagger';

export class ErrorsMessagesViewModel {
  @ApiProperty({
    description: 'Причина возникновения ошибки',
  })
  'message': string;

  @ApiProperty({
    description: 'Поле вызвавшее ошибку',
    nullable: true,
  })
  'field': string;
}

export class ErrorResponseViewModel {
  @ApiProperty({
    description: 'Http код ошибки',
  })
  statusCode: number;

  @ApiProperty({
    type: () => [ErrorsMessagesViewModel],
  })
  errorsMessages: ErrorsMessagesViewModel[];

  @ApiProperty({
    description: 'Время возникновения ошибки',
  })
  timestamp: string;

  @ApiProperty({
    description: 'Адрес эндпоинта, в котором произошла ошибка',
  })
  path: string;
}
