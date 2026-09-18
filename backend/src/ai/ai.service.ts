import { Injectable } from '@nestjs/common';

type AdvisorContext = {
  studentName: string;
  major: string;
  gpa: number;
  careerGoal: string;
  courses: Array<{
    code: string;
    name: string;
    credits: number;
  }>;
};

@Injectable()
export class AiService {
  async explainAcademicPlan(context: AdvisorContext): Promise<string> {
    const apiKey = process.env.AI_API_KEY;
    const baseUrl = process.env.AI_BASE_URL ?? 'https://api.openai.com/v1';
    const model = process.env.AI_MODEL ?? 'gpt-4o-mini';

    if (!apiKey) {
      return this.fallback(context);
    }

    const courseText = context.courses
      .map(
        (course) =>
          `${course.code} ${course.name} (${course.credits} tín chỉ)`
      )
      .join(', ');

    const prompt = [
      'Bạn là trợ lý cố vấn học tập của UniPilot.',
      'Business rule engine đã xác minh danh sách môn bên dưới.',
      'Không được thêm môn học mới hoặc tự thay đổi điều kiện tiên quyết.',
      `Sinh viên: ${context.studentName}`,
      `Ngành: ${context.major}`,
      `GPA: ${context.gpa.toFixed(2)}`,
      `Mục tiêu nghề nghiệp: ${context.careerGoal}`,
      `Môn được hệ thống chọn: ${courseText}`,
      'Hãy giải thích trong 3-5 câu tiếng Việt, ngắn gọn và nhắc sinh viên xác nhận với cố vấn học tập trước khi đăng ký chính thức.'
    ].join('\n');

    try {
      const response = await fetch(
        `${baseUrl.replace(/\/$/, '')}/chat/completions`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model,
            temperature: 0.2,
            messages: [
              {
                role: 'user',
                content: prompt
              }
            ]
          })
        }
      );

      if (!response.ok) {
        return this.fallback(context);
      }

      const data = (await response.json()) as {
        choices?: Array<{
          message?: {
            content?: string;
          };
        }>;
      };

      return data.choices?.[0]?.message?.content?.trim() || this.fallback(context);
    } catch {
      return this.fallback(context);
    }
  }

  private fallback(context: AdvisorContext): string {
    if (context.courses.length === 0) {
      return 'Hiện chưa có môn phù hợp trong giới hạn tín chỉ đã chọn. Hãy kiểm tra môn tiên quyết hoặc tăng giới hạn tín chỉ.';
    }

    const names = context.courses.map((course) => course.name).join(', ');

    return `Với mục tiêu ${context.careerGoal}, hệ thống ưu tiên ${names}. Các môn này đã vượt qua kiểm tra điều kiện tiên quyết bằng rule engine. GPA hiện tại của bạn là ${context.gpa.toFixed(2)}; hãy xác nhận kế hoạch với cố vấn học tập trước khi đăng ký chính thức.`;
  }
}
