import {
  MiddlewareConsumer,
  Module,
  NestModule,
  DynamicModule,
} from '@nestjs/common';

import { AuthMiddleware } from './auth.middleware';
import { ConfigInjectionToken, AuthModuleConfig } from './config.interface';
import { SupertokensService } from './supertokens/supertokens.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user';
import { IAuthAsyncConfig } from './interface';

@Module({})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }

  static forRootAsync(config: IAuthAsyncConfig): DynamicModule {
    return {
      providers: [
        {
          inject: config.inject,
          useFactory: config.useFactory,
          provide: ConfigInjectionToken,
        },
        SupertokensService,
      ],
      exports: [],
      imports: [UserModule],
      controllers: [AuthController],
      module: AuthModule,
    };
  }
  static forRoot({
    connectionURI,
    apiKey,
    appInfo,
  }: AuthModuleConfig): DynamicModule {
    return {
      providers: [
        {
          useValue: {
            appInfo,
            connectionURI,
            apiKey,
          },
          provide: ConfigInjectionToken,
        },
        SupertokensService,
      ],
      exports: [],
      imports: [UserModule],
      controllers: [AuthController],
      module: AuthModule,
    };
  }
}
