import { UserModule } from '../user';
import { Module } from '@nestjs/common';
import { MockUsers } from '../../mock/mock-users';
import { OnAppInitService } from './on-app-init.service';

@Module({
  imports: [UserModule],
  providers: [OnAppInitService],
})
export class OnAppInitModule {
  constructor(private readonly onAppInitService: OnAppInitService) {}

  async onModuleInit() {
    console.info('OnAppInitModule started');
    try {
      await this.onAppInitService.createUser(MockUsers);
    } catch (e) {
      console.error('error when creating user');
    }
  }
}
