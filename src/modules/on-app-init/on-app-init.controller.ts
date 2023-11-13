import { Controller, Get } from '@nestjs/common';
import { OnAppInitService } from './on-app-init.service';
import { MockUsers } from '../../mock/mock-users';

@Controller('on-app-init')
export class OnAppInitController {
  constructor(private readonly onAppInitService: OnAppInitService) {}

  @Get()
  async onAppInit() {
    await this.onAppInitService.createUser(MockUsers);
  }
}
