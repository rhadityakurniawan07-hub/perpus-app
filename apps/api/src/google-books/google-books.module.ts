import { Module } from '@nestjs/common';
import { GoogleBooksService } from './google-books.service';
import { GoogleBooksController } from './google-books.controller';

@Module({
  controllers: [GoogleBooksController],
  providers: [GoogleBooksService],
  exports: [GoogleBooksService],
})
export class GoogleBooksModule {}
