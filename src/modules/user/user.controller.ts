import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard, IMSession, Session } from '../auth';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @UseGuards(new AuthGuard())
  getUser(@Session() session: IMSession) {
    const userId = session.getAccessTokenPayload().appUserId;
    return this.userService.getUserById({
      id: userId,
    });
  }
}
