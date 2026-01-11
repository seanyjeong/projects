import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { UniversityService } from './university.service';

@ApiTags('University')
@Controller('universities')
export class UniversityController {
  constructor(private readonly universityService: UniversityService) {}

  @Get()
  @ApiOperation({ summary: '대학 목록 조회' })
  @ApiQuery({ name: 'region', required: false, description: '지역 필터' })
  async findAll(@Query('region') region?: string) {
    return this.universityService.findAll(region);
  }

  @Get(':id')
  @ApiOperation({ summary: '대학 상세 조회' })
  async findOne(@Param('id') id: string) {
    return this.universityService.findOne(id);
  }

  @Get(':id/departments')
  @ApiOperation({ summary: '대학 학과 목록 조회' })
  async findDepartments(@Param('id') id: string) {
    return this.universityService.findDepartments(id);
  }
}

@ApiTags('Department')
@Controller('departments')
export class DepartmentController {
  constructor(private readonly universityService: UniversityService) {}

  @Get('search')
  @ApiOperation({ summary: '학과 검색' })
  @ApiQuery({
    name: 'q',
    required: false,
    description: '검색어 (대학명 또는 학과명)',
  })
  @ApiQuery({
    name: 'recruitGroup',
    required: false,
    description: '모집군 (가/나/다)',
  })
  @ApiQuery({
    name: 'region',
    required: false,
    description: '지역 필터',
  })
  @ApiQuery({
    name: 'year',
    required: false,
    description: '입시년도',
    type: Number,
  })
  async searchDepartments(
    @Query('q') query?: string,
    @Query('recruitGroup') recruitGroup?: string,
    @Query('region') region?: string,
    @Query('year') year?: string,
  ) {
    return this.universityService.searchDepartments({
      query,
      recruitGroup,
      region,
      year: year ? parseInt(year, 10) : undefined,
    });
  }
}
