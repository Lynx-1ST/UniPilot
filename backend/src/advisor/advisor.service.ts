import { Injectable } from '@nestjs/common';
import { AiService } from '../ai/ai.service';
import { StudentsService } from '../students/students.service';
import { AcademicRuleEngineService } from './academic-rule-engine.service';

@Injectable()
export class AdvisorService {
  constructor(
    private readonly studentsService: StudentsService,
    private readonly rules: AcademicRuleEngineService,
    private readonly ai: AiService
  ) {}

  async getEligibility(careerGoal = 'Backend Developer') {
    const student = await this.studentsService.getDemoStudent();
    return this.rules.evaluate(student.id, careerGoal);
  }

  async buildPlan(careerGoal = 'Backend Developer', maxCredits = 12) {
    const student = await this.studentsService.getDemoStudent();
    const courses = await this.rules.buildPlan(
      student.id,
      careerGoal,
      maxCredits
    );

    const advisorMessage = await this.ai.explainAcademicPlan({
      studentName: student.fullName,
      major: student.major,
      gpa: student.gpa,
      careerGoal,
      courses
    });

    return {
      studentId: student.id,
      careerGoal,
      maxCredits,
      plannedCredits: courses.reduce(
        (total, course) => total + course.credits,
        0
      ),
      courses: courses.map((course) => ({
        code: course.code,
        name: course.name,
        credits: course.credits,
        reason:
          course.careerScore > 0
            ? 'Phù hợp trực tiếp với mục tiêu nghề nghiệp.'
            : 'Phù hợp với lộ trình và điều kiện tiên quyết hiện tại.'
      })),
      advisorMessage
    };
  }
}
