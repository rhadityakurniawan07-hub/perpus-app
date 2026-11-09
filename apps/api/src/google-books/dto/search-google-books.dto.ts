import { IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchGoogleBooksDto {
  @IsString()
  @IsNotEmpty({ message: 'Kata pencarian wajib diisi.' })
  q: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(40)
  maxResults?: number = 10;
}
