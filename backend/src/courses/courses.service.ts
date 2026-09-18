import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CoursesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.course.findMany({
      orderBy: [
        { suggestedSemester: 'asc' },
        { code: 'asc' }
      ],
      include: {
        prerequisites: {
          include: {
            prerequisite: true
          }
        }
      }
    });
  }
}
