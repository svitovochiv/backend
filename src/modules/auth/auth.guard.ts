import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Error as STError } from 'supertokens-node';

import { verifySession } from 'supertokens-node/recipe/session/framework/express';
import { CSession } from './interface';
import { UserReadService } from '../user-read';
import { IS_PUBLIC_KEY } from './is-public.decorator';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    // private readonly verifyOptions?: VerifySessionOptions,
    private readonly userService?: UserReadService,
    private readonly reflector?: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = context.switchToHttp();

    let err = undefined;
    const resp = ctx.getResponse();
    const request = ctx.getRequest();
    const isPublic = this.reflector?.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true; // Skip authentication if route is public
    }
    // You can create an optional version of this by passing {sessionRequired: false} to verifySession
    await verifySession()(request, resp, (res) => {
      err = res;
    });

    if (resp.headersSent) {
      throw new STError({
        message: 'RESPONSE_SENT',
        type: 'RESPONSE_SENT',
      });
    }

    if (err) {
      throw err;
    }
    const session: CSession = ctx.getRequest().session;
    const userId = session.getAccessTokenPayload().appUserId;

    if (this.userService) {
      console.log('service');
      request.userData = await this.userService?.getUserById({ id: userId });
      console.log(request.userData);
    }
    return true;
  }
}
