import { Controller, Get } from '@nestjs/common';
import { MockUsers } from '../../mock/mock-users';
import { IsPublic } from '../auth';
import { OnAppInitService } from './on-app-init.service';

@Controller('on-app-init')
export class OnAppInitController {
  constructor(private readonly onAppInitService: OnAppInitService) {}

  @Get()
  @IsPublic()
  async onAppInit() {
    await this.onAppInitService.createUser(MockUsers);
  }
}
