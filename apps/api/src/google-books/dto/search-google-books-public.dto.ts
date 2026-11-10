import { IsInt, IsNotEmpty, IsOptional, IsString, Max, Min, MinLength } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchGoogleBooksPublicDto {
  @IsString()
  @MinLength(2, { message: 'Kata pencarian minimal 2 karakter.' })
  @IsNotEmpty({ message: 'Kata pencarian wajib diisi.' })
  q: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  startIndex?: number = 0;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(40)
  maxResults?: number = 40;
}
