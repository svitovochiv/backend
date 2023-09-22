import { Module } from '@nestjs/common';
import { AuthModule, OnAppInitModule } from './modules';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { appConfig } from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      envFilePath: ['.env'],
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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
