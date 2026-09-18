import { Module } from '@nestjs/common';
import { AdvisorModule } from './advisor/advisor.module';
import { AiModule } from './ai/ai.module';
import { CoursesModule } from './courses/courses.module';
import { HealthController } from './health/health.controller';
import { PrismaModule } from './prisma/prisma.module';
import { StudentsModule } from './students/students.module';

@Module({
  imports: [
    PrismaModule,
    CoursesModule,
    StudentsModule,
    AiModule,
    AdvisorModule
  ],
  controllers: [HealthController]
})
export class AppModule {}
