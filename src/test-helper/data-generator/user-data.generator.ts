import { User } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { Role } from '../../domain';

export class UserDataGenerator {
  static user(data?: Partial<User>): User {
    return {
      email: faker.internet.email(),
      id: faker.string.uuid(),
      createdAt: faker.date.past(),
      updatedAt: faker.date.past(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      role: faker.helpers.enumValue(Role),
      authId: faker.string.uuid(),
      ...data,
    };
  }

  static customer(data?: Partial<User>): User {
    return UserDataGenerator.user({ role: Role.CUSTOMER, ...data });
  }
}
