import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsEnum,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

/** 실기 종목 기록 */
class PracticalRecordDto {
  @ApiProperty({ example: '100m' })
  @IsString()
  eventName: string;

  @ApiProperty({ example: 11.5 })
  @IsNumber()
  record: number;
}

/** 실기 점수 계산 요청 */
export class PracticalCalculateDto {
  @ApiProperty({
    example: 'dept-123',
    description: '학과 ID',
  })
  @IsString()
  departmentId: string;

  @ApiProperty({ example: 'male', enum: ['male', 'female'] })
  @IsEnum(['male', 'female'])
  gender: 'male' | 'female';

  @ApiProperty({ type: [PracticalRecordDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PracticalRecordDto)
  records: PracticalRecordDto[];
}

/** 실기 종목별 결과 */
class PracticalEventDetailDto {
  @ApiProperty({ example: '100m' })
  eventName: string;

  @ApiProperty({ example: 11.5 })
  record: number;

  @ApiProperty({ example: 95 })
  score: number;
}

/** 실기 점수 계산 응답 */
export class PracticalCalculateResponseDto {
  @ApiProperty({ example: 'dept-123' })
  departmentId: string;

  @ApiProperty({ example: 580 })
  silgiScore: number;

  @ApiProperty({ example: 600 })
  maxScore: number;

  @ApiProperty({ type: [PracticalEventDetailDto] })
  details: PracticalEventDetailDto[];
}
