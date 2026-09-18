import { Module } from '@nestjs/common';
import { AiModule } from '../ai/ai.module';
import { StudentsModule } from '../students/students.module';
import { AcademicRuleEngineService } from './academic-rule-engine.service';
import { AdvisorController } from './advisor.controller';
import { AdvisorService } from './advisor.service';

@Module({
  imports: [StudentsModule, AiModule],
  controllers: [AdvisorController],
  providers: [AdvisorService, AcademicRuleEngineService]
})
export class AdvisorModule {}
