import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  getHealth() {
    return {
      status: 'ok',
      service: 'UniPilot.Api',
      stack: 'NestJS + Prisma + PostgreSQL'
    };
  }
}
