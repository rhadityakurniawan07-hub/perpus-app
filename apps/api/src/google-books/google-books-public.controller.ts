import {
  Controller,
  Get,
  Query,
} from '@nestjs/common';
import { GoogleBooksService } from './google-books.service';
import { SearchGoogleBooksPublicDto } from './dto/search-google-books-public.dto';

@Controller('google-books/public')
export class GoogleBooksPublicController {
  constructor(private readonly googleBooksService: GoogleBooksService) {}

  @Get('search')
  search(@Query() query: SearchGoogleBooksPublicDto) {
    return this.googleBooksService.searchPublic(
      query.q,
      query.startIndex,
      query.maxResults,
    );
  }
}
