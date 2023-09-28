import { PrismaService } from '../prisma';
import { CreateUserWithRoleDto } from '../../domain';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  getByAuthId(authId: string) {
    return this.user.findUnique({
      where: { authId },
    });
  }

  create(params: CreateUserWithRoleDto) {
    return this.user.create({
      data: {
        role: params.role,
        authId: params.authId,
        email: params.email,
        firstName: params.firstName,
        lastName: params.lastName,
      },
    });
  }

  getById({ id }: { id: string }) {
    return this.user.findUnique({
      where: { id },
    });
  }

  private get user() {
    return this.prismaService.user;
  }
}
