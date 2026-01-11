import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UniversityService {
  constructor(private prisma: PrismaService) {}

  /**
   * 대학 목록 조회 (필터: 지역)
   */
  async findAll(region?: string) {
    return this.prisma.university.findMany({
      where: region ? { region } : undefined,
      select: {
        id: true,
        name: true,
        region: true,
        type: true,
        _count: {
          select: {
            departments: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  /**
   * 대학 상세 조회 (학과 목록 포함)
   */
  async findOne(id: string) {
    const university = await this.prisma.university.findUnique({
      where: { id },
      include: {
        departments: {
          orderBy: {
            name: 'asc',
          },
        },
      },
    });

    if (!university) {
      throw new NotFoundException('대학을 찾을 수 없습니다');
    }

    return university;
  }

  /**
   * 특정 대학의 학과 목록 조회
   */
  async findDepartments(universityId: string) {
    return this.prisma.department.findMany({
      where: { universityId },
      orderBy: {
        name: 'asc',
      },
    });
  }

  /**
   * 학과 검색 (대학명, 학과명으로 검색)
   * 필터: 군별(가/나/다), 지역, 연도
   */
  async searchDepartments(params: {
    query?: string;
    recruitGroup?: string;
    region?: string;
    year?: number;
  }) {
    const { query, recruitGroup, region, year = 2026 } = params;

    return this.prisma.department.findMany({
      where: {
        year,
        ...(recruitGroup && { recruitGroup }),
        ...(query && {
          OR: [
            {
              name: {
                contains: query,
              },
            },
            {
              university: {
                name: {
                  contains: query,
                },
              },
            },
          ],
        }),
        ...(region && {
          university: {
            region,
          },
        }),
      },
      include: {
        university: {
          select: {
            id: true,
            name: true,
            region: true,
            type: true,
          },
        },
      },
      orderBy: [
        {
          university: {
            name: 'asc',
          },
        },
        {
          name: 'asc',
        },
      ],
    });
  }
}
