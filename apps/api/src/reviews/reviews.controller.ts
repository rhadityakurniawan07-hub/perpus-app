import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CreateReviewDto } from './dto/create-review.dto';
import { SetReadingStatusDto } from './dto/reading-status.dto';

@Controller()
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  @Get('books/:bookId/reviews')
  getBookReviews(@Param('bookId') bookId: string) {
    return this.reviewsService.getBookReviews(bookId);
  }

  @Get('books/:bookId/me')
  @UseGuards(JwtAuthGuard)
  getBookUserState(
    @CurrentUser('sub') userId: string,
    @Param('bookId') bookId: string,
  ) {
    return this.reviewsService.getBookUserState(userId, bookId);
  }

  @Post('books/:bookId/reviews')
  @UseGuards(JwtAuthGuard)
  upsertReview(
    @CurrentUser('sub') userId: string,
    @Param('bookId') bookId: string,
    @Body() dto: CreateReviewDto,
  ) {
    return this.reviewsService.upsertReview(userId, bookId, dto);
  }

  @Delete('reviews/:id')
  @UseGuards(JwtAuthGuard)
  deleteReview(@CurrentUser('sub') userId: string, @Param('id') id: string) {
    return this.reviewsService.deleteReview(userId, id);
  }

  @Get('reviews/mine')
  @UseGuards(JwtAuthGuard)
  getMyReviews(@CurrentUser('sub') userId: string) {
    return this.reviewsService.getMyReviews(userId);
  }

  @Get('reviews/my-stats')
  @UseGuards(JwtAuthGuard)
  getMyStats(@CurrentUser('sub') userId: string) {
    return this.reviewsService.getMyStats(userId);
  }

  @Get('reading/me')
  @UseGuards(JwtAuthGuard)
  getMyReading(
    @CurrentUser('sub') userId: string,
    @Query('status') status?: string,
  ) {
    return this.reviewsService.getMyReading(userId, status);
  }

  @Put('books/:bookId/reading-status')
  @UseGuards(JwtAuthGuard)
  setReadingStatus(
    @CurrentUser('sub') userId: string,
    @Param('bookId') bookId: string,
    @Body() dto: SetReadingStatusDto,
  ) {
    return this.reviewsService.setReadingStatus(userId, bookId, dto.status);
  }
}
