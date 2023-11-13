import { Controller, Get } from '@nestjs/common';
import { IsPublic } from '../modules';

@Controller('healthy')
export class HealthyController {
  @Get()
  @IsPublic()
  getHealthy() {
    return { healthy: true };
  }
}
