import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import {
  CreateUserDto,
  CreateUserWithRoleDto,
  Role,
  UserDto,
} from '../../domain';
import { MockUsers } from '../../mock/mock-users';
import { BadRequestError } from '../../exceptions';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getByAuthId(authId: string) {
    const savedUser = await this.userRepository.getByAuthId(authId);
    if (savedUser) {
      return new UserDto({
        id: savedUser.id,
        email: savedUser.email,
        firstName: savedUser.firstName ? savedUser.firstName : undefined,
        lastName: savedUser.lastName ? savedUser.lastName : undefined,
        role: savedUser.role as Role,
      });
    }
    throw new BadRequestError('Користувача не знайдено');
  }

  create(createUserDto: CreateUserDto) {
    const userWithRole = this.assignRole(createUserDto);
    return this.userRepository.create(userWithRole);
  }

  getUserById(params: { id: string }) {
    return this.userRepository.getById(params);
  }

  private assignRole(createUserDto: CreateUserDto): CreateUserWithRoleDto {
    const isEmailInMockUsers = MockUsers.some(
      (user) => user.email === createUserDto.email,
    );
    let role = Role.CUSTOMER;
    if (isEmailInMockUsers) {
      role = Role.ADMIN;
    }
    return new CreateUserWithRoleDto({
      createUserDto: createUserDto,
      role,
    });
  }
}
