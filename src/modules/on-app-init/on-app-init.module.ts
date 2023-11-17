import { UserModule } from '../user';
import { Module } from '@nestjs/common';
import { MockUsers } from '../../mock/mock-users';
import { OnAppInitService } from './on-app-init.service';
import { OnAppInitController } from './on-app-init.controller';

@Module({
  imports: [UserModule],
  providers: [OnAppInitService],
  controllers: [OnAppInitController],
})
export class OnAppInitModule {
  constructor(private readonly onAppInitService: OnAppInitService) {}

  async onModuleInit() {
    console.info('OnAppInitModule started');
    try {
      await this.onAppInitService.createUser(MockUsers);
    } catch (e) {
      console.error('error when creating user');
      console.error(e);
    }
  }
}
