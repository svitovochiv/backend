import { CreateUserDto } from './create-user.dto';
import { Role } from '../role';

type CreatUserWithRoleDtoType = {
  createUserDto: CreateUserDto;
} & {
  role: Role;
};

export class CreateUserWithRoleDto extends CreateUserDto {
  role: Role;

  constructor(params: CreatUserWithRoleDtoType) {
    const { createUserDto } = params;
    super({
      authId: createUserDto.authId,
      email: createUserDto.email,
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
    });
    this.role = params.role;
  }
}
