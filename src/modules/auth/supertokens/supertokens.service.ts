import { Inject, Injectable } from '@nestjs/common';
import supertokens from 'supertokens-node';
import Session from 'supertokens-node/recipe/session';
import ThirdPartyEmailPassword from 'supertokens-node/recipe/thirdpartyemailpassword';
import EmailVerification from 'supertokens-node/recipe/emailverification';
import Multitenancy from 'supertokens-node/recipe/multitenancy';
import { ConfigService } from '@nestjs/config';
import { AuthModuleConfig, ConfigInjectionToken } from '../config.interface';
import { UserService } from '../../user';
import { IUserRegisterField } from '../interface';

@Injectable()
export class SupertokensService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    @Inject(ConfigInjectionToken) private config: AuthModuleConfig,
  ) {
    supertokens.init({
      appInfo: {
        apiDomain: config.appInfo.apiDomain,
        appName: config.appInfo.appName,
        apiBasePath: config.appInfo.apiBasePath,
        websiteDomain: config.appInfo.websiteBasePath,
        origin: (input) => {
          if (input.request !== undefined) {
            const origin = input.request.getHeaderValue('origin');
            //
            if (origin === undefined) {
              // this means the client is in an iframe, it's a mobile app, or
              // there is a privacy setting on the frontend which doesn't send
              // the origin
            } else {
              return origin;
            }
          }
          // in case the origin is unknown or not set, we return a default
          // value which will be used for this request.
          return 'https://test.example.com';
        },
      },
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
                  try {
                    const user = await userService.getByAuthId(input.userId);
                    if (user) {
                      input.accessTokenPayload = {
                        ...input.accessTokenPayload,
                        appUserId: user.id,
                      };
                    }

                    return originalImplementation.createNewSession(input);
                  } catch (e) {
                    console.error('Failed to auth with google', e);
                    throw e;
                  }
                },
              };
            },
          },
        }),
        Multitenancy.init({
          // eslint-disable-next-line @typescript-eslint/require-await
          getAllowedDomainsForTenantId: async () => {
            // query your db to get the allowed domain for the input tenantId
            // or you can make the tenantId equal to the sub domain itself
            return [
              this.configService.get<string>('WEBSITE_URL'),
              this.configService.get<string>('CLIENT_WEBSITE_URL'),
              this.configService.get<string>('ADMIN_AMPLIFY_URL'),
              this.configService.get<string>('CLIENT_AMPLIFY_URL'),
            ] as string[];
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
                        email: response.user.emails[0],
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
