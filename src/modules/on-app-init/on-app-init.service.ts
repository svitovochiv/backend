import { UserService } from '../user';
import { Injectable } from '@nestjs/common';
import EmailPassword from 'supertokens-node/recipe/thirdpartyemailpassword';
import EmailVerification from 'supertokens-node/recipe/emailverification';
import { CreateUserDto, SignupUserDto } from '../../domain';

@Injectable()
export class OnAppInitService {
  constructor(private readonly userService: UserService) {}

  async createUser(creds: SignupUserDto[]) {
    for (const cred of creds) {
      console.info(`Creating mock user: ${cred.email}`);
      const response = await EmailPassword.emailPasswordSignUp(
        '',
        cred.email,
        cred.password,
      );
      if (response.status === 'OK') {
        console.log('user created in supertokens: ', response.user);
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
        try {
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
        } catch (e) {
          console.error(e);
        }
      } else if (response.status === 'EMAIL_ALREADY_EXISTS_ERROR') {
        const supertokensUsers = await EmailPassword.getUsersByEmail(
          '',
          cred.email,
        );

        const supertokensUser = supertokensUsers[0];
        if (supertokensUser) {
          try {
            const user = new CreateUserDto({
              authId: supertokensUser.id,
              email: cred.email,
              firstName: cred.firstName,
              lastName: cred.lastName,
            });
            // EmailPassword.
            const createdUser = await this.userService.create(user);
            console.info(`Mock user created: ${createdUser.email}`);
          } catch (e) {
            console.error(e);
          }
        }

        console.error(`Failed user creation: ${cred.email}`, response.status);
      }
    }
  }
}
