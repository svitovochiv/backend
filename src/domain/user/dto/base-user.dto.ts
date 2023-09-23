export class BaseUserDto {
  email: string;
  firstName: string;
  lastName: string;
  constructor(baseUserDto: BaseUserDto) {
    this.email = baseUserDto.email;
    this.firstName = baseUserDto.firstName;
    this.lastName = baseUserDto.lastName;
  }
}
