import { SignupUserDto } from './signup-user.dto';
import { BaseUserDto } from './base-user.dto';

export class CreateUserDto extends BaseUserDto {
  authId: string;

  constructor(createUserDto: CreateUserDto) {
    super({
      email: createUserDto.email,
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
    });
    this.authId = createUserDto.authId;
  }
}
