import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard, IMSession, Session } from '../auth';
import { BadRequestError } from '../../exceptions';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @UseGuards(new AuthGuard())
  async getUser(@Session() session: IMSession) {
    const user = await this.userService.getByAuthId(session.getUserId());
    if (user) {
      await session.mergeIntoAccessTokenPayload({ appUserId: user.id });
      return user;
    }
    throw new BadRequestError('User not found');
  }
}
