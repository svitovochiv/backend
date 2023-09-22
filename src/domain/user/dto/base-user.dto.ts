export class BaseUserDto {
  email: string;
  firstName: string;
  lastName: string;
  constructor(baseUserDto: BaseUserDto) {
    Object.assign(this, baseUserDto);
  }
}
