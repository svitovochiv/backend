import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto, CreateUserWithRoleDto, Role } from '../../domain';
import { MockUsers } from '../../mock/mock-users';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  getByAuthId(authId: string) {
    return this.userRepository.getByAuthId(authId);
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
