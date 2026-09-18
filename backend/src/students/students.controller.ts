import { Controller, Get } from '@nestjs/common';
import { StudentsService } from './students.service';

@Controller('api/students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get('demo')
  getDemoStudent() {
    return this.studentsService.getDemoStudent();
  }
}
