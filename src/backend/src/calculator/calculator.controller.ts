import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CalculatorService } from './calculator.service';
import {
  SuneungCalculateDto,
  SuneungCalculateResponseDto,
} from './dto/suneung-calculate.dto';
import {
  PracticalCalculateDto,
  PracticalCalculateResponseDto,
} from './dto/practical-calculate.dto';
import {
  TotalCalculateDto,
  TotalCalculateResponseDto,
} from './dto/total-calculate.dto';
import {
  CompareCalculateDto,
  CompareCalculateResponseDto,
} from './dto/compare-calculate.dto';

@ApiTags('Calculator')
@Controller('calculate')
export class CalculatorController {
  constructor(private readonly calculatorService: CalculatorService) {}

  @Post('suneung')
  @ApiOperation({
    summary: '수능 점수 계산',
    description: '학과의 수능 반영비율에 따라 수능 점수를 계산합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '계산 성공',
    type: SuneungCalculateResponseDto,
  })
  @ApiResponse({ status: 400, description: '잘못된 요청' })
  @ApiResponse({ status: 404, description: '학과를 찾을 수 없음' })
  async calculateSuneung(
    @Body() dto: SuneungCalculateDto,
  ): Promise<SuneungCalculateResponseDto> {
    return this.calculatorService.calculateSuneung(dto);
  }

  @Post('silgi')
  @ApiOperation({
    summary: '실기 점수 계산',
    description: '학과의 실기 배점표에 따라 실기 점수를 계산합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '계산 성공',
    type: PracticalCalculateResponseDto,
  })
  @ApiResponse({ status: 400, description: '잘못된 요청' })
  @ApiResponse({ status: 404, description: '학과를 찾을 수 없음' })
  async calculatePractical(
    @Body() dto: PracticalCalculateDto,
  ): Promise<PracticalCalculateResponseDto> {
    return this.calculatorService.calculatePractical(dto);
  }

  @Post('total')
  @ApiOperation({
    summary: '총점 계산',
    description: '수능 + 실기 총점을 계산합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '계산 성공',
    type: TotalCalculateResponseDto,
  })
  @ApiResponse({ status: 400, description: '잘못된 요청' })
  @ApiResponse({ status: 404, description: '학과를 찾을 수 없음' })
  async calculateTotal(
    @Body() dto: TotalCalculateDto,
  ): Promise<TotalCalculateResponseDto> {
    return this.calculatorService.calculateTotal(dto);
  }

  @Post('compare')
  @ApiOperation({
    summary: '여러 대학 비교 계산',
    description: '동일한 점수로 여러 대학을 비교하여 점수순으로 정렬합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '계산 성공',
    type: CompareCalculateResponseDto,
  })
  @ApiResponse({ status: 400, description: '잘못된 요청' })
  async compareUniversities(
    @Body() dto: CompareCalculateDto,
  ): Promise<CompareCalculateResponseDto> {
    return this.calculatorService.compareUniversities(dto);
  }
}
