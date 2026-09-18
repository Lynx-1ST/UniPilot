import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AdvisorService } from './advisor.service';
import { PlanRequestDto } from './dto/plan-request.dto';

@Controller('api/advisor')
export class AdvisorController {
  constructor(private readonly advisorService: AdvisorService) {}

  @Get('eligible/demo')
  getEligibility(@Query('careerGoal') careerGoal?: string) {
    return this.advisorService.getEligibility(
      careerGoal?.trim() || 'Backend Developer'
    );
  }

  @Post('plan/demo')
  buildPlan(@Body() request: PlanRequestDto) {
    return this.advisorService.buildPlan(
      request.careerGoal?.trim() || 'Backend Developer',
      request.maxCredits ?? 12
    );
  }
}
