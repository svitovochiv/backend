import { BaseUserDto } from './base-user.dto';

export class SignupUserDto extends BaseUserDto {
  password: string;
  constructor(signupUserDto: SignupUserDto) {
    super({
      email: signupUserDto.email,
      firstName: signupUserDto.firstName,
      lastName: signupUserDto.lastName,
    });
    this.password = signupUserDto.password;
  }
}
