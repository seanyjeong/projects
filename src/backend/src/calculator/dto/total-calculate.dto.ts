import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsArray,
  ValidateNested,
  IsNumber,
  IsOptional,
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

/** 실기 종목 기록 */
class PracticalRecordDto {
  @ApiProperty({ example: '100m' })
  @IsString()
  eventName: string;

  @ApiProperty({ example: 11.5 })
  @IsNumber()
  record: number;
}

/** 총점 계산 요청 */
export class TotalCalculateDto {
  @ApiProperty({
    example: 'dept-123',
    description: '학과 ID',
  })
  @IsString()
  departmentId: string;

  @ApiProperty({ type: SuneungScoresDto })
  @ValidateNested()
  @Type(() => SuneungScoresDto)
  suneungScores: SuneungScoresDto;

  @ApiProperty({ type: [PracticalRecordDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PracticalRecordDto)
  silgiRecords: PracticalRecordDto[];

  @ApiProperty({ example: 'male', enum: ['male', 'female'] })
  @IsEnum(['male', 'female'])
  gender: 'male' | 'female';
}

/** 총점 계산 응답 */
export class TotalCalculateResponseDto {
  @ApiProperty({ example: 'dept-123' })
  departmentId: string;

  @ApiProperty({ example: '서울대학교' })
  universityName: string;

  @ApiProperty({ example: '체육교육과' })
  departmentName: string;

  @ApiProperty({ example: 965.5 })
  totalScore: number;

  @ApiProperty({ example: 1000 })
  maxScore: number;

  @ApiProperty({
    example: {
      suneung: {
        score: 385.5,
        max: 400,
        ratio: 40,
      },
      silgi: {
        score: 580,
        max: 600,
        ratio: 60,
      },
    },
  })
  breakdown: {
    suneung: {
      score: number;
      max: number;
      ratio: number;
    };
    silgi: {
      score: number;
      max: number;
      ratio: number;
    };
  };
}
