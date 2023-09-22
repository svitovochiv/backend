import { ModuleMetadata } from '@nestjs/common';
import { AuthModuleConfig } from './config.interface';
import { SessionContainer } from 'supertokens-node/recipe/session';

export interface IUserRegisterField {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

export interface IAuthAsyncConfig extends Pick<ModuleMetadata, 'imports'> {
  useFactory: (
    ...args: unknown[]
  ) => Promise<AuthModuleConfig> | AuthModuleConfig;
  inject?: any[];
}

export interface IMSession extends SessionContainer {
  getAccessTokenPayload: (userContext?: any) => ReturnType<
    SessionContainer['getAccessTokenPayload']
  > & {
    appUserId: string;
  };
}
