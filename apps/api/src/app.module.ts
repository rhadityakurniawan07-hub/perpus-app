import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { LoggerModule } from 'nestjs-pino';
import { SentryModule } from '@sentry/nestjs/setup';
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
    SentryModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
    LoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        pinoHttp: {
          transport: configService.get('NODE_ENV') !== 'production'
            ? { target: 'pino-pretty', options: { colorize: true, translateTime: 'SYS:standard' } }
            : undefined,
          level: configService.get('NODE_ENV') === 'production' ? 'info' : 'debug',
          serializers: {
            req: (req: any) => ({ method: req.method, url: req.url }),
            res: (res: any) => ({ statusCode: res.statusCode }),
          },
        },
      }),
    }),
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        throttlers: [
          { name: 'short', ttl: 1000, limit: 3 },
          { name: 'medium', ttl: 10000, limit: 20 },
          { name: 'long', ttl: 60000, limit: 100 },
        ],
      }),
    }),
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
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
