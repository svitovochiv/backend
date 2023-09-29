import { Inject, Injectable } from '@nestjs/common';
import supertokens from 'supertokens-node';
import Session from 'supertokens-node/recipe/session';
import ThirdPartyEmailPassword from 'supertokens-node/recipe/thirdpartyemailpassword';
import EmailVerification from 'supertokens-node/recipe/emailverification';
import Multitenancy from 'supertokens-node/recipe/multitenancy';
import { AuthModuleConfig, ConfigInjectionToken } from '../config.interface';
import { UserService } from '../../user';
import { IUserRegisterField } from '../interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SupertokensService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    @Inject(ConfigInjectionToken) private config: AuthModuleConfig,
  ) {
    supertokens.init({
      appInfo: config.appInfo,
      supertokens: {
        connectionURI: config.connectionURI,
        apiKey: config.apiKey,
      },
      recipeList: [
        Session.init({
          getTokenTransferMethod: () => 'header',
          override: {
            functions: (originalImplementation) => {
              return {
                ...originalImplementation,
                createNewSession: async function (input) {
                  const user = await userService.getByAuthId(input.userId);
                  // This goes in the access token, and is availble to read on the frontend.
                  if (user) {
                    input.accessTokenPayload = {
                      ...input.accessTokenPayload,
                      appUserId: user.id,
                    };
                  }

                  return originalImplementation.createNewSession(input);
                },
              };
            },
          },
        }),
        Multitenancy.init({
          getAllowedDomainsForTenantId: async () => {
            // query your db to get the allowed domain for the input tenantId
            // or you can make the tenantId equal to the sub domain itself
            return [
              this.config.appInfo.websiteDomain + ':3001',
              this.config.appInfo.websiteDomain + ':3000',
            ];
          },
        }),
        EmailVerification.init({
          mode: 'OPTIONAL', // or "OPTIONAL"
          emailDelivery: {
            override: (originalImplementation) => {
              return {
                ...originalImplementation,
                sendEmail: (input) => {
                  return originalImplementation.sendEmail({
                    ...input,
                    // emailVerifyLink: input.emailVerifyLink.replace(
                    //   `${this.configService.get(
                    //     'WEBSITE_URL',
                    //   )}/auth/verify-email`,
                    //   `${this.configService.get(
                    //     'WEBSITE_URL',
                    //   )}/verificationLink`,
                    // ),
                  });
                },
              };
            },
          },
        }),
        ThirdPartyEmailPassword.init({
          signUpFeature: {
            formFields: [
              {
                id: 'firstName',
              },
              {
                id: 'lastName',
              },
              {
                id: 'password',
              },
            ],
          },
          emailDelivery: {
            override: (originalImplementation) => {
              return {
                ...originalImplementation,
                sendEmail: async (input) => {
                  if (input.type === 'PASSWORD_RESET') {
                    return originalImplementation.sendEmail({
                      ...input,
                    });
                  }
                  return originalImplementation.sendEmail(input);
                },
              };
            },
          },
          override: {
            apis: (originalImplementation) => {
              return {
                ...originalImplementation,
                emailPasswordSignUpPOST: async (input) => {
                  if (
                    originalImplementation.emailPasswordSignUpPOST === undefined
                  ) {
                    throw Error('Should never come here');
                  }
                  const response =
                    await originalImplementation.emailPasswordSignUpPOST(input);
                  if (response.status === 'OK') {
                    const formFields = input.formFields;
                    const formatted = formFields.reduce(
                      (result: IUserRegisterField, { id, value }) => {
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        result[id] = value;
                        return result;
                      },
                      {} as IUserRegisterField,
                    );
                    await this.userService.create({
                      authId: response.user.id,
                      email: formatted.email,
                      firstName: formatted.firstName,
                      lastName: formatted.lastName,
                    });
                  }
                  return response;
                },
                thirdPartySignInUpPOST: async (input) => {
                  if (
                    originalImplementation.thirdPartySignInUpPOST === undefined
                  ) {
                    throw Error('Should never come here');
                  }
                  const response =
                    await originalImplementation.thirdPartySignInUpPOST(input);
                  if (response.status === 'OK') {
                    try {
                      await this.userService.create({
                        authId: response.user.id,
                        email: response.user.email,
                        // firstName: response.user.email.split('@')[0],
                        // lastName: response.user.email.split('@')[1],
                      });
                    } catch (error) {
                      console.error(error);
                    }
                  }
                  return response;
                },
              };
            },
          },
          providers: [
            {
              config: {
                thirdPartyId: 'google',
                clients: [
                  {
                    clientId:
                      '1060725074195-kmeum4crr01uirfl2op9kd5acmi9jutn.apps.googleusercontent.com',
                    clientSecret: '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',
                    scope: ['email', 'profile'],
                  },
                ],
              },
            },

            // ThirdPartyEmailPassword.Google({
            //   clientId: this.configService.get('GOOGLE_CLIENT_ID'),
            //   clientSecret: this.configService.get('GOOGLE_CLIENT_SECRET'),
            //   scope: googleScopes,
            // }),
          ],
        }),
      ],
    });
  }
}
