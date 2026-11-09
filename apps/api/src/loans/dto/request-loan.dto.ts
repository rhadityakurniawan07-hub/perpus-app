import { IsNotEmpty, IsString } from 'class-validator';

export class RequestLoanDto {
  @IsString()
  @IsNotEmpty({ message: 'bookId wajib diisi.' })
  bookId: string;
}
