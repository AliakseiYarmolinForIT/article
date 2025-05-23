import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SortDirection } from 'src/common/enums/sort-direction.enum';
import { SortBy } from '../../common/enums/sort-by.enum';
import { Type } from 'class-transformer';

export class GetArticlesPaginationDto {
  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  @ApiProperty({ required: false, default: 1 })
  public pageNumber: number = 1;

  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  @Type(() => Number)
  @ApiProperty({ required: false, default: 10 })
  public pageSize: number = 10;

  @IsEnum(SortBy)
  @IsOptional()
  @ApiProperty({ required: false, default: SortBy.CreatedAt })
  public sortBy?: SortBy = SortBy.CreatedAt;

  @IsEnum(SortDirection)
  @IsOptional()
  @ApiProperty({
    required: false,
    enum: SortDirection,
    default: SortDirection.Desc,
  })
  public sortDirection?: SortDirection = SortDirection.Desc;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  public searchTitleTerm?: string;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  @ApiProperty({ required: false })
  public searchUserId?: number;
}
