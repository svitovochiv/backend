import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Error as STError } from 'supertokens-node';

import { verifySession } from 'supertokens-node/recipe/session/framework/express';
import { Reflector } from '@nestjs/core';
import { UserReadService } from '../user-read';
import { BadRequestError } from '../../exceptions';
import { CSession } from './interface';
import { IS_PUBLIC_KEY } from './is-public.decorator';

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

    if (!userId) {
      throw new BadRequestError('User without id try to access');
    }
    if (this.userService) {
      request.userData = await this.userService?.getUserById({ id: userId });
    }
    return true;
  }
}
