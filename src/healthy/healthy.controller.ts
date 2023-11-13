import { Controller, Get } from '@nestjs/common';

@Controller('healthy')
export class HealthyController {
  @Get()
  getHealthy() {
    return { healthy: true };
  }
}
