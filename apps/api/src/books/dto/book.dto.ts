import { IsNotEmpty, IsString, IsOptional, IsInt, IsUrl } from 'class-validator';

export class CreateBookDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  author: string;

  @IsNotEmpty()
  @IsString()
  publisher: string;

  @IsNotEmpty()
  @IsString()
  categoryId: string;

  @IsOptional()
  @IsString()
  isbn?: string;

  @IsNotEmpty()
  @IsInt()
  year: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUrl()
  coverImage?: string;

  @IsNotEmpty()
  @IsInt()
  totalStock: number;

  @IsOptional()
  @IsInt()
  availableStock?: number;

  @IsOptional()
  @IsString()
  shelfLocation?: string;
}

export class UpdateBookDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  author?: string;

  @IsOptional()
  @IsString()
  publisher?: string;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsString()
  isbn?: string;

  @IsOptional()
  @IsInt()
  year?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUrl()
  coverImage?: string;

  @IsOptional()
  @IsInt()
  totalStock?: number;

  @IsOptional()
  @IsInt()
  availableStock?: number;

  @IsOptional()
  @IsString()
  shelfLocation?: string;
}
