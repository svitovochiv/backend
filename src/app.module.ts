import { Module } from '@nestjs/common';
import {
  AuthGuard,
  AuthModule,
  OnAppInitModule,
  OrderModule,
  ProductModule,
} from './modules';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { appConfig } from './config';
import { MulterModule } from '@nestjs/platform-express';
import { HttpExceptionFilter } from './exceptions';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { BasketModule } from './modules/basket';
import { UserReadModule } from './modules/user-read';
import { ProductFinancialCalculatorModule } from './modules/product-financical-calculator';

@Module({
  imports: [
    UserReadModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      envFilePath: ['.env'],
    }),
    MulterModule.registerAsync({
      useFactory: () => ({
        dest: './upload',
      }),
    }),
    AuthModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        connectionURI: configService.get<string>('SUPERTOKENS_URL') as string,
        appInfo: {
          appName: 'manager',
          apiDomain: configService.get<string>('API_URL') as string,
          // websiteDomain: configService.get<string>('WEBSITE_DOMAIN') as string,
          websiteDomain: `${configService.get<string>(
            'WEBSITE_DOMAIN',
          )}` as string,
          apiBasePath: '/api/auth',
          websiteBasePath: '/auth',
        },
      }),
    }),
    ProductFinancialCalculatorModule,
    BasketModule,
    ProductModule,
    OrderModule,
    OnAppInitModule,
  ],
  controllers: [],
  providers: [
    {
      useClass: HttpExceptionFilter,
      provide: APP_FILTER,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
