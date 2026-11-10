import { Module } from '@nestjs/common';
import { GoogleBooksService } from './google-books.service';
import { GoogleBooksController } from './google-books.controller';
import { GoogleBooksPublicController } from './google-books-public.controller';

@Module({
  controllers: [GoogleBooksController, GoogleBooksPublicController],
  providers: [GoogleBooksService],
  exports: [GoogleBooksService],
})
export class GoogleBooksModule {}
