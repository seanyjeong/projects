import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  ValidateNested,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';

/** 개별 과목 점수 */
class SubjectScoreDto {
  @ApiProperty({ example: 130, required: false })
  @IsOptional()
  @IsNumber()
  standard?: number;

  @ApiProperty({ example: 95, required: false })
  @IsOptional()
  @IsNumber()
  percentile?: number;

  @ApiProperty({ example: 2 })
  @IsNumber()
  grade: number;

  @ApiProperty({ example: '미적분', required: false })
  @IsOptional()
  @IsString()
  subject?: string;
}

/** 탐구 과목 점수 */
class InquiryScoreDto extends SubjectScoreDto {
  @ApiProperty({ example: '생활과윤리' })
  @IsString()
  subject: string;
}

/** 수능 점수 입력 */
class SuneungScoresDto {
  @ApiProperty({ type: SubjectScoreDto })
  @ValidateNested()
  @Type(() => SubjectScoreDto)
  korean: SubjectScoreDto;

  @ApiProperty({ type: SubjectScoreDto })
  @ValidateNested()
  @Type(() => SubjectScoreDto)
  math: SubjectScoreDto;

  @ApiProperty({
    example: { grade: 2 },
    description: '영어는 등급만 입력',
  })
  @IsObject()
  english: { grade: number };

  @ApiProperty({ type: InquiryScoreDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => InquiryScoreDto)
  tamgu1?: InquiryScoreDto;

  @ApiProperty({ type: InquiryScoreDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => InquiryScoreDto)
  tamgu2?: InquiryScoreDto;

  @ApiProperty({
    example: { grade: 3 },
    required: false,
  })
  @IsOptional()
  @IsObject()
  history?: { grade: number };
}

/** 수능 점수 계산 요청 */
export class SuneungCalculateDto {
  @ApiProperty({
    example: 'dept-123',
    description: '학과 ID',
  })
  @IsString()
  departmentId: string;

  @ApiProperty({ type: SuneungScoresDto })
  @ValidateNested()
  @Type(() => SuneungScoresDto)
  scores: SuneungScoresDto;
}

/** 수능 점수 계산 응답 */
export class SuneungCalculateResponseDto {
  @ApiProperty({ example: 'dept-123' })
  departmentId: string;

  @ApiProperty({ example: 385.5 })
  suneungScore: number;

  @ApiProperty({ example: 400 })
  maxScore: number;

  @ApiProperty({
    example: {
      korean: 115.5,
      english: 98,
      tamgu: 172,
    },
  })
  details: Record<string, number>;
}
