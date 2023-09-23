import { Module } from '@nestjs/common';
import { AuthModule, OnAppInitModule, ProductModule } from './modules';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { appConfig } from './config';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
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
        connectionURI: configService.get('SUPERTOKENS_URL'),
        appInfo: {
          appName: 'game',
          apiDomain: configService.get('API_URL'),
          websiteDomain: configService.get('WEBSITE_URL'),
          apiBasePath: '/api/auth',
          websiteBasePath: '/auth',
        },
      }),
    }),
    OnAppInitModule,
    ProductModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
