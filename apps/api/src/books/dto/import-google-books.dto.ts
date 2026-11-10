import { IsNotEmpty, IsString } from 'class-validator';

export class ImportGoogleBooksDto {
  @IsString()
  @IsNotEmpty({ message: 'volumeId Google Books wajib diisi.' })
  volumeId: string;
}
