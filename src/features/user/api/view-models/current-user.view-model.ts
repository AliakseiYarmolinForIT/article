import { ApiProperty } from '@nestjs/swagger';

export class CurrentUserViewModel {
  @ApiProperty({
    description: 'Id пользователя',
    example: '777',
  })
  public id: string;

  @ApiProperty({
    description: 'Имя пользователя',
    example: 'Toretto',
  })
  public userName: string;

  @ApiProperty({
    example: 'Email пользователя',
  })
  public email: string;
}
