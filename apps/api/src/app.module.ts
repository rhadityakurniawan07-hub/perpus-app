import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { BooksModule } from './books/books.module';
import { MembersModule } from './members/members.module';
import { LoansModule } from './loans/loans.module';
import { ReportsModule } from './reports/reports.module';
import { SettingsModule } from './settings/settings.module';
import { CategoriesModule } from './categories/categories.module';
import { ReviewsModule } from './reviews/reviews.module';
import { GoogleBooksModule } from './google-books/google-books.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    BooksModule,
    MembersModule,
    LoansModule,
    ReportsModule,
    SettingsModule,
    CategoriesModule,
    ReviewsModule,
    GoogleBooksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
