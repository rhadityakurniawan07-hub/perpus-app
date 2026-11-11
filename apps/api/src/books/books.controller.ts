import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { BooksService } from './books.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/guards/roles.guard';
import { Role } from '@perpus-app/prisma-client';
import { CreateBookDto, UpdateBookDto } from './dto/book.dto';
import { ImportGoogleBooksDto } from './dto/import-google-books.dto';

@Controller('books')
export class BooksController {
  constructor(private booksService: BooksService) {}

  @Get()
  findAll(@Query() query: any) {
    return this.booksService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.booksService.findOne(id);
  }

  @Post('import-google-books')
  @UseGuards(JwtAuthGuard)
  importGoogleBooks(@Body() dto: ImportGoogleBooksDto) {
    return this.booksService.importGoogleBooks(dto.volumeId);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  create(@Body() data: CreateBookDto) {
    return this.booksService.create(data);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() data: UpdateBookDto) {
    return this.booksService.update(id, data);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.booksService.remove(id);
  }
}
