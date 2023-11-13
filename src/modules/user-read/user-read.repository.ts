import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma';

@Injectable()
export class UserReadRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getUserById(data: { id: string }) {
    return this.prisma.user.findUnique({
      where: {
        id: data.id,
      },
    });
  }
}
