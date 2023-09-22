import { UserModule, UserService } from '../user';
import { Module } from '@nestjs/common';
import EmailPassword from 'supertokens-node/recipe/thirdpartyemailpassword';
import EmailVerification from 'supertokens-node/recipe/emailverification';
import { CreateUserDto, SignupUserDto } from '../../domain';
import { MockUsers } from '../../mock/mock-users';

@Module({
  imports: [UserModule],
})
export class OnAppInitModule {
  constructor(private readonly userService: UserService) {}

  private async createUser(creds: SignupUserDto[]) {
    console.log('Creating mock users');
    for (const cred of creds) {
      const response = await EmailPassword.emailPasswordSignUp(
        '',
        cred.email,
        cred.password,
      );
      if (response.status === 'OK') {
        const resEmailVerificationToken =
          await EmailVerification.createEmailVerificationToken(
            'public',
            response.user.id,
          );
        // If the token creation is successful, use the token to verify the user's email
        if (resEmailVerificationToken.status === 'OK') {
          await EmailVerification.verifyEmailUsingToken(
            'public',
            resEmailVerificationToken.token,
          );
        }
        const resUser = response.user;
        const user = new CreateUserDto({
          authId: resUser.id,
          email: resUser.email,
          firstName: cred.firstName,
          lastName: cred.lastName,
        });
        // EmailPassword.
        const createdUser = await this.userService.create(user);
        console.info(`Mock user created: ${createdUser.email}`);
      } else {
        console.error(`Failed user creation: ${cred.email}`, response.status);
      }
    }
  }

  async onModuleInit() {
    console.info('OnAppInitModule started');
    await this.createUser(MockUsers);
  }
}
