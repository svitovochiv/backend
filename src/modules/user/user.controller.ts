import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import { AuthGuard, CSession, Session } from '../auth';
import { BadRequestError } from '../../exceptions';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(@Inject(UserService) private readonly userService: UserService) {}

  @Get('me')
  @UseGuards(new AuthGuard())
  async getUser(@Session() session: CSession) {
    const user = await this.userService.getByAuthId(session.getUserId());
    if (user) {
      await session.mergeIntoAccessTokenPayload({ appUserId: user.id });
      return user;
    }
    throw new BadRequestError('User not found');
  }
}
