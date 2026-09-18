import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export type EligibleCourse = {
  code: string;
  name: string;
  credits: number;
  suggestedSemester: number;
  tags: string[];
  eligible: boolean;
  missingPrerequisites: string[];
  careerScore: number;
};

@Injectable()
export class AcademicRuleEngineService {
  constructor(private readonly prisma: PrismaService) {}

  async evaluate(
    studentId: string,
    careerGoal: string
  ): Promise<EligibleCourse[]> {
    const [student, courses] = await Promise.all([
      this.prisma.student.findUniqueOrThrow({
        where: { id: studentId },
        include: {
          completedCourses: {
            include: {
              course: true
            }
          }
        }
      }),
      this.prisma.course.findMany({
        include: {
          prerequisites: {
            include: {
              prerequisite: true
            }
          }
        }
      })
    ]);

    const completed = new Set(
      student.completedCourses.map((item) => item.course.code)
    );

    const terms = careerGoal
      .toLowerCase()
      .replace(/[.\-_/]/g, ' ')
      .split(/\s+/)
      .filter(Boolean);

    return courses
      .filter((course) => !completed.has(course.code))
      .map((course) => {
        const missingPrerequisites = course.prerequisites
          .map((item) => item.prerequisite.code)
          .filter((code) => !completed.has(code));

        const careerScore = course.tags.filter((tag) =>
          terms.some(
            (term) => tag.includes(term) || term.includes(tag)
          )
        ).length;

        return {
          code: course.code,
          name: course.name,
          credits: course.credits,
          suggestedSemester: course.suggestedSemester,
          tags: course.tags,
          eligible: missingPrerequisites.length === 0,
          missingPrerequisites,
          careerScore
        };
      })
      .sort((a, b) => {
        if (a.eligible !== b.eligible) return a.eligible ? -1 : 1;
        if (a.careerScore !== b.careerScore) {
          return b.careerScore - a.careerScore;
        }
        if (a.suggestedSemester !== b.suggestedSemester) {
          return a.suggestedSemester - b.suggestedSemester;
        }
        return a.code.localeCompare(b.code);
      });
  }

  async buildPlan(
    studentId: string,
    careerGoal: string,
    maxCredits: number
  ) {
    const eligible = (await this.evaluate(studentId, careerGoal))
      .filter((course) => course.eligible)
      .sort((a, b) => {
        if (a.careerScore !== b.careerScore) {
          return b.careerScore - a.careerScore;
        }
        return a.suggestedSemester - b.suggestedSemester;
      });

    const selected: EligibleCourse[] = [];
    let usedCredits = 0;

    for (const course of eligible) {
      if (usedCredits + course.credits > maxCredits) continue;
      selected.push(course);
      usedCredits += course.credits;
    }

    return selected;
  }
}
