import { ApiProperty } from '@nestjs/swagger';

export class IdViewModel {
  @ApiProperty({
    description: 'Id добавленной сущности',
    example: '777',
  })
  public id: string;
}
