import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StudentsService {
  constructor(private readonly prisma: PrismaService) {}

  async getDemoStudent() {
    const student = await this.prisma.student.findFirst({
      where: {
        fullName: 'Nguyễn Minh An',
        cohort: 2024
      },
      include: {
        completedCourses: {
          include: {
            course: true
          }
        }
      }
    });

    if (!student) {
      throw new NotFoundException(
        'Demo student not found. Run npm run prisma:seed first.'
      );
    }

    return {
      ...student,
      completedCourseCodes: student.completedCourses.map(
        (item) => item.course.code
      )
    };
  }
}
