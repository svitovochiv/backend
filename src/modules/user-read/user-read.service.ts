import { UserReadRepository } from './user-read.repository';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Role, UserDto } from '../../domain';

@Injectable()
export class UserReadService {
  constructor(private readonly userReadRepository: UserReadRepository) {}

  async getUserById(data: { id: string }) {
    const savedUser = await this.userReadRepository.getUserById(data);
    if (!savedUser) {
      throw new BadRequestException('User not found');
    }
    return new UserDto({
      email: savedUser.email,
      firstName: savedUser.firstName ? savedUser.firstName : undefined,
      lastName: savedUser.lastName ? savedUser.lastName : undefined,
      role: savedUser.role as Role,
    });
  }
}
