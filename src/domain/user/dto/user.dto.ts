import { Role } from '../role';

export class UserDto {
  email: string;
  firstName?: string;
  lastName?: string;
  role: Role;
  constructor(baseUserDto: UserDto) {
    this.email = baseUserDto.email;
    this.firstName = baseUserDto.firstName;
    this.lastName = baseUserDto.lastName;
    this.role = baseUserDto.role;
  }
}
