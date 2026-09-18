import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const courses = [
  { code: 'PRG101', name: 'Programming Fundamentals', credits: 3, prerequisites: [], tags: ['programming'], suggestedSemester: 1 },
  { code: 'OOP201', name: 'Object-Oriented Programming', credits: 3, prerequisites: ['PRG101'], tags: ['programming', 'backend'], suggestedSemester: 2 },
  { code: 'DSA202', name: 'Data Structures & Algorithms', credits: 3, prerequisites: ['PRG101'], tags: ['algorithms', 'backend'], suggestedSemester: 3 },
  { code: 'DBS203', name: 'Database Systems', credits: 3, prerequisites: ['PRG101'], tags: ['database', 'backend'], suggestedSemester: 3 },
  { code: 'WEB204', name: 'Web Development', credits: 3, prerequisites: ['OOP201'], tags: ['web', 'frontend', 'backend'], suggestedSemester: 4 },
  { code: 'NET301', name: 'Computer Networks', credits: 3, prerequisites: ['DSA202'], tags: ['network', 'cloud'], suggestedSemester: 5 },
  { code: 'SWT302', name: 'Software Testing', credits: 3, prerequisites: ['OOP201'], tags: ['testing', 'software-engineering'], suggestedSemester: 5 },
  { code: 'SWA303', name: 'Software Architecture', credits: 3, prerequisites: ['OOP201', 'DBS203'], tags: ['architecture', 'backend', 'software-engineering'], suggestedSemester: 5 },
  { code: 'DEV304', name: 'DevOps Fundamentals', credits: 3, prerequisites: ['WEB204'], tags: ['devops', 'cloud', 'backend'], suggestedSemester: 6 },
  { code: 'CLD305', name: 'Cloud Computing', credits: 3, prerequisites: ['NET301'], tags: ['cloud', 'devops', 'backend'], suggestedSemester: 6 },
  { code: 'DST401', name: 'Distributed Systems', credits: 3, prerequisites: ['NET301', 'SWA303'], tags: ['distributed', 'backend', 'cloud'], suggestedSemester: 7 },
  { code: 'SEC402', name: 'Application Security', credits: 3, prerequisites: ['WEB204', 'NET301'], tags: ['security', 'backend'], suggestedSemester: 7 },
  { code: 'AI403', name: 'Applied Artificial Intelligence', credits: 3, prerequisites: ['DSA202'], tags: ['ai', 'data'], suggestedSemester: 7 },
  { code: 'CAP491', name: 'Capstone Project I', credits: 6, prerequisites: ['SWA303', 'SWT302'], tags: ['capstone', 'software-engineering'], suggestedSemester: 8 },
  { code: 'CAP492', name: 'Capstone Project II', credits: 6, prerequisites: ['CAP491'], tags: ['capstone', 'software-engineering'], suggestedSemester: 9 }
];

async function main() {
  for (const course of courses) {
    await prisma.course.upsert({
      where: { code: course.code },
      update: {
        name: course.name,
        credits: course.credits,
        tags: course.tags,
        suggestedSemester: course.suggestedSemester
      },
      create: {
        code: course.code,
        name: course.name,
        credits: course.credits,
        tags: course.tags,
        suggestedSemester: course.suggestedSemester
      }
    });
  }

  const courseMap = new Map(
    (await prisma.course.findMany()).map((course) => [course.code, course])
  );

  await prisma.coursePrerequisite.deleteMany();

  for (const course of courses) {
    const target = courseMap.get(course.code);
    if (!target) continue;

    for (const prerequisiteCode of course.prerequisites) {
      const prerequisite = courseMap.get(prerequisiteCode);
      if (!prerequisite) continue;

      await prisma.coursePrerequisite.create({
        data: {
          courseId: target.id,
          prerequisiteId: prerequisite.id
        }
      });
    }
  }

  let student = await prisma.student.findFirst({
    where: { fullName: 'Nguyễn Minh An', cohort: 2024 }
  });

  if (!student) {
    student = await prisma.student.create({
      data: {
        fullName: 'Nguyễn Minh An',
        major: 'Công nghệ phần mềm',
        cohort: 2024,
        gpa: 3.21,
        earnedCredits: 78,
        requiredCredits: 120
      }
    });
  }

  const completedCodes = ['PRG101', 'OOP201', 'DSA202', 'DBS203', 'WEB204'];

  for (const code of completedCodes) {
    const course = courseMap.get(code);
    if (!course) continue;

    await prisma.studentCourseCompletion.upsert({
      where: {
        studentId_courseId: {
          studentId: student.id,
          courseId: course.id
        }
      },
      update: {},
      create: {
        studentId: student.id,
        courseId: course.id
      }
    });
  }

  console.log('UniPilot seed completed.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
