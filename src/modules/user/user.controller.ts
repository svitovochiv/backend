import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard, CSession, Session } from '../auth';
import { BadRequestError } from '../../exceptions';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

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
