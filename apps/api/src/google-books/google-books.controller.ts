import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GoogleBooksService } from './google-books.service';
import { SearchGoogleBooksDto } from './dto/search-google-books.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../common/guards/roles.guard';
import { Role } from '@perpus-app/prisma-client';

@Controller('google-books')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class GoogleBooksController {
  constructor(private readonly googleBooksService: GoogleBooksService) {}

  @Get('search')
  search(@Query() query: SearchGoogleBooksDto) {
    return this.googleBooksService.search(query.q, query.maxResults);
  }

  @Get(':volumeId')
  findOne(@Param('volumeId') volumeId: string) {
    return this.googleBooksService.findByVolumeId(volumeId);
  }
}
