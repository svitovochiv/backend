import { Role } from '../role';
import { IsNotEmpty, IsString } from 'class-validator';

export class UserDto {
  @IsString()
  @IsNotEmpty()
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: Role;
  constructor(userDto: UserDto) {
    this.id = userDto.id;
    this.email = userDto.email;
    this.firstName = userDto.firstName;
    this.lastName = userDto.lastName;
    this.role = userDto.role;
  }
}
