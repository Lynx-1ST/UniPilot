import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

export class PlanRequestDto {
  @IsOptional()
  @IsString()
  @MaxLength(160)
  careerGoal?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(3)
  @Max(24)
  maxCredits?: number;
}
