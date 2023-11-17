import { UserService } from '../user';
import { Injectable } from '@nestjs/common';
import EmailPassword from 'supertokens-node/recipe/thirdpartyemailpassword';
import { CreateUserDto, SignupUserDto } from '../../domain';

import EmailVerification from 'supertokens-node/recipe/emailverification';
import supertokens, { deleteUser } from 'supertokens-node';
import RecipeUserId from 'supertokens-node/lib/build/recipeUserId';

async function manuallyVerifyEmail(recipeUserId: supertokens.RecipeUserId) {
  try {
    // Create an email verification token for the user
    const tokenRes = await EmailVerification.createEmailVerificationToken(
      'public',
      recipeUserId,
    );

    // If the token creation is successful, use the token to verify the user's email
    if (tokenRes.status === 'OK') {
      return await EmailVerification.verifyEmailUsingToken(
        'public',
        tokenRes.token,
      );
    }
  } catch (err) {
    console.error(err);
  }
}

@Injectable()
export class OnAppInitService {
  constructor(private readonly userService: UserService) {}

  async createUser(creds: SignupUserDto[]) {
    for (const cred of creds) {
      console.info(`Creating mock user: ${cred.email}`);
      await supertokens.deleteUser(cred.email, true);

      const response = await EmailPassword.emailPasswordSignUp(
        '',
        cred.email,
        cred.password,
      );
      console.info('response: ', response);
      if (response.status === 'OK') {
        console.log('user created in supertokens: ', response.user);
        await manuallyVerifyEmail(new RecipeUserId(response.user.id));
        try {
          const resUser = response.user;
          const user = new CreateUserDto({
            authId: resUser.id,
            email: resUser.emails[0],
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
        const supertokensUser = await supertokens.getUser('public', {
          email: cred.email,
        });

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
