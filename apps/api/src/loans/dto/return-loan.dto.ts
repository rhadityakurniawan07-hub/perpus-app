import { IsDateString, IsOptional } from 'class-validator';

export class ReturnLoanDto {
  @IsOptional()
  @IsDateString()
  returnDate?: string;
}
