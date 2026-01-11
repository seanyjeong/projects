import { Test, TestingModule } from '@nestjs/testing';
import { UniversityService } from './university.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('UniversityService', () => {
  let service: UniversityService;
  let prisma: PrismaService;

  // Mock PrismaService
  const mockPrismaService = {
    university: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    department: {
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UniversityService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UniversityService>(UniversityService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('모든 대학 목록을 조회해야 함', async () => {
      const mockUniversities = [
        {
          id: 'univ-001',
          name: '서울대학교',
          region: '서울',
          type: '국립',
          _count: { departments: 5 },
        },
        {
          id: 'univ-002',
          name: '연세대학교',
          region: '서울',
          type: '사립',
          _count: { departments: 3 },
        },
      ];

      mockPrismaService.university.findMany.mockResolvedValue(mockUniversities);

      const result = await service.findAll();

      expect(result).toEqual(mockUniversities);
      expect(prisma.university.findMany).toHaveBeenCalledWith({
        where: undefined,
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
    });

    it('지역 필터로 대학을 조회해야 함', async () => {
      const mockSeoulUniversities = [
        {
          id: 'univ-001',
          name: '서울대학교',
          region: '서울',
          type: '국립',
          _count: { departments: 5 },
        },
      ];

      mockPrismaService.university.findMany.mockResolvedValue(
        mockSeoulUniversities,
      );

      const result = await service.findAll('서울');

      expect(result).toEqual(mockSeoulUniversities);
      expect(prisma.university.findMany).toHaveBeenCalledWith({
        where: { region: '서울' },
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
    });

    it('대학이 없으면 빈 배열을 반환해야 함', async () => {
      mockPrismaService.university.findMany.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });

    it('대학 목록이 이름순으로 정렬되어야 함', async () => {
      const mockUniversities = [
        {
          id: 'univ-002',
          name: '가천대학교',
          region: '경기',
          type: '사립',
          _count: { departments: 2 },
        },
        {
          id: 'univ-001',
          name: '서울대학교',
          region: '서울',
          type: '국립',
          _count: { departments: 5 },
        },
      ];

      mockPrismaService.university.findMany.mockResolvedValue(mockUniversities);

      const result = await service.findAll();

      // Mock이 정렬된 결과를 반환하므로, 정렬이 유지되는지 확인
      expect(result[0].name).toBe('가천대학교');
      expect(result[1].name).toBe('서울대학교');
    });
  });

  describe('findOne', () => {
    it('특정 대학의 상세 정보를 조회해야 함', async () => {
      const mockUniversity = {
        id: 'univ-001',
        name: '서울대학교',
        region: '서울',
        type: '국립',
        createdAt: new Date(),
        updatedAt: new Date(),
        departments: [
          {
            id: 'dept-001',
            name: '체육교육과',
            recruitGroup: '가',
            year: 2026,
          },
          {
            id: 'dept-002',
            name: '스포츠과학과',
            recruitGroup: '나',
            year: 2026,
          },
        ],
      };

      mockPrismaService.university.findUnique.mockResolvedValue(
        mockUniversity,
      );

      const result = await service.findOne('univ-001');

      expect(result).toEqual(mockUniversity);
      expect(prisma.university.findUnique).toHaveBeenCalledWith({
        where: { id: 'univ-001' },
        include: {
          departments: {
            orderBy: {
              name: 'asc',
            },
          },
        },
      });
    });

    it('존재하지 않는 대학 ID로 조회하면 NotFoundException을 발생시켜야 함', async () => {
      mockPrismaService.university.findUnique.mockResolvedValue(null);

      await expect(service.findOne('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findOne('invalid-id')).rejects.toThrow(
        '대학을 찾을 수 없습니다',
      );
    });

    it('대학의 학과 목록이 이름순으로 정렬되어야 함', async () => {
      const mockUniversity = {
        id: 'univ-001',
        name: '서울대학교',
        region: '서울',
        type: '국립',
        createdAt: new Date(),
        updatedAt: new Date(),
        departments: [
          {
            id: 'dept-002',
            name: '스포츠과학과',
            recruitGroup: '나',
            year: 2026,
          },
          {
            id: 'dept-001',
            name: '체육교육과',
            recruitGroup: '가',
            year: 2026,
          },
        ],
      };

      mockPrismaService.university.findUnique.mockResolvedValue(
        mockUniversity,
      );

      const result = await service.findOne('univ-001');

      expect(result.departments[0].name).toBe('스포츠과학과');
      expect(result.departments[1].name).toBe('체육교육과');
    });
  });

  describe('findDepartments', () => {
    it('특정 대학의 학과 목록을 조회해야 함', async () => {
      const mockDepartments = [
        {
          id: 'dept-001',
          name: '체육교육과',
          universityId: 'univ-001',
          recruitGroup: '가',
          year: 2026,
        },
        {
          id: 'dept-002',
          name: '스포츠과학과',
          universityId: 'univ-001',
          recruitGroup: '나',
          year: 2026,
        },
      ];

      mockPrismaService.department.findMany.mockResolvedValue(mockDepartments);

      const result = await service.findDepartments('univ-001');

      expect(result).toEqual(mockDepartments);
      expect(prisma.department.findMany).toHaveBeenCalledWith({
        where: { universityId: 'univ-001' },
        orderBy: {
          name: 'asc',
        },
      });
    });

    it('학과가 없는 대학이면 빈 배열을 반환해야 함', async () => {
      mockPrismaService.department.findMany.mockResolvedValue([]);

      const result = await service.findDepartments('univ-999');

      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });
  });

  describe('searchDepartments', () => {
    it('학과를 검색어로 조회해야 함', async () => {
      const mockDepartments = [
        {
          id: 'dept-001',
          name: '체육교육과',
          universityId: 'univ-001',
          recruitGroup: '가',
          year: 2026,
          university: {
            id: 'univ-001',
            name: '서울대학교',
            region: '서울',
            type: '국립',
          },
        },
      ];

      mockPrismaService.department.findMany.mockResolvedValue(mockDepartments);

      const result = await service.searchDepartments({ query: '체육' });

      expect(result).toEqual(mockDepartments);
      expect(prisma.department.findMany).toHaveBeenCalledWith({
        where: {
          year: 2026,
          OR: [
            {
              name: {
                contains: '체육',
              },
            },
            {
              university: {
                name: {
                  contains: '체육',
                },
              },
            },
          ],
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
    });

    it('모집군으로 학과를 필터링해야 함', async () => {
      const mockDepartments = [
        {
          id: 'dept-001',
          name: '체육교육과',
          universityId: 'univ-001',
          recruitGroup: '가',
          year: 2026,
          university: {
            id: 'univ-001',
            name: '서울대학교',
            region: '서울',
            type: '국립',
          },
        },
      ];

      mockPrismaService.department.findMany.mockResolvedValue(mockDepartments);

      const result = await service.searchDepartments({ recruitGroup: '가' });

      expect(result).toEqual(mockDepartments);
      expect(prisma.department.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            recruitGroup: '가',
          }),
        }),
      );
    });

    it('지역으로 학과를 필터링해야 함', async () => {
      const mockDepartments = [
        {
          id: 'dept-001',
          name: '체육교육과',
          universityId: 'univ-001',
          recruitGroup: '가',
          year: 2026,
          university: {
            id: 'univ-001',
            name: '서울대학교',
            region: '서울',
            type: '국립',
          },
        },
      ];

      mockPrismaService.department.findMany.mockResolvedValue(mockDepartments);

      const result = await service.searchDepartments({ region: '서울' });

      expect(result).toEqual(mockDepartments);
      expect(prisma.department.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            university: {
              region: '서울',
            },
          }),
        }),
      );
    });

    it('연도로 학과를 필터링해야 함', async () => {
      const mockDepartments = [
        {
          id: 'dept-001',
          name: '체육교육과',
          universityId: 'univ-001',
          recruitGroup: '가',
          year: 2027,
          university: {
            id: 'univ-001',
            name: '서울대학교',
            region: '서울',
            type: '국립',
          },
        },
      ];

      mockPrismaService.department.findMany.mockResolvedValue(mockDepartments);

      const result = await service.searchDepartments({ year: 2027 });

      expect(result).toEqual(mockDepartments);
      expect(prisma.department.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            year: 2027,
          }),
        }),
      );
    });

    it('여러 필터를 동시에 적용해야 함', async () => {
      const mockDepartments = [
        {
          id: 'dept-001',
          name: '체육교육과',
          universityId: 'univ-001',
          recruitGroup: '가',
          year: 2026,
          university: {
            id: 'univ-001',
            name: '서울대학교',
            region: '서울',
            type: '국립',
          },
        },
      ];

      mockPrismaService.department.findMany.mockResolvedValue(mockDepartments);

      const result = await service.searchDepartments({
        query: '체육',
        recruitGroup: '가',
        region: '서울',
        year: 2026,
      });

      expect(result).toEqual(mockDepartments);
      expect(prisma.department.findMany).toHaveBeenCalledWith({
        where: {
          year: 2026,
          recruitGroup: '가',
          OR: [
            {
              name: {
                contains: '체육',
              },
            },
            {
              university: {
                name: {
                  contains: '체육',
                },
              },
            },
          ],
          university: {
            region: '서울',
          },
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
    });

    it('검색 결과가 없으면 빈 배열을 반환해야 함', async () => {
      mockPrismaService.department.findMany.mockResolvedValue([]);

      const result = await service.searchDepartments({
        query: '존재하지않는학과',
      });

      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });

    it('검색 결과가 대학명, 학과명 순으로 정렬되어야 함', async () => {
      const mockDepartments = [
        {
          id: 'dept-002',
          name: '스포츠과학과',
          universityId: 'univ-001',
          recruitGroup: '나',
          year: 2026,
          university: {
            id: 'univ-001',
            name: '가천대학교',
            region: '경기',
            type: '사립',
          },
        },
        {
          id: 'dept-001',
          name: '체육교육과',
          universityId: 'univ-002',
          recruitGroup: '가',
          year: 2026,
          university: {
            id: 'univ-002',
            name: '서울대학교',
            region: '서울',
            type: '국립',
          },
        },
      ];

      mockPrismaService.department.findMany.mockResolvedValue(mockDepartments);

      const result = await service.searchDepartments({ query: '체육' });

      // Mock이 정렬된 결과를 반환하므로, 정렬이 유지되는지 확인
      expect(result[0].university.name).toBe('가천대학교');
      expect(result[1].university.name).toBe('서울대학교');
    });
  });
});
