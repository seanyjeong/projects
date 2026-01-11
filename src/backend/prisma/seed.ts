import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('시드 데이터 삽입 시작...');

  // 기존 데이터 삭제 (개발용)
  await prisma.department.deleteMany();
  await prisma.university.deleteMany();
  console.log('기존 데이터 삭제 완료');

  // 1. 한국체육대학교 (가군)
  const knsu = await prisma.university.create({
    data: {
      name: '한국체육대학교',
      region: '서울',
      type: '국립',
      departments: {
        create: [
          {
            name: '체육학과',
            recruitGroup: '가',
            recruitCount: 80,
            year: 2026,
            formula: {
              suneungRatio: 40,
              silgiRatio: 60,
              suneungWeights: {
                korean: 25,
                english: 25,
                math: 0,
                tamgu: 50,
                history: 0,
              },
              suneungTypes: {
                korean: 'percentile',
                math: 'percentile',
                tamgu: 'percentile',
              },
              englishGrades: {
                '1': 100,
                '2': 98,
                '3': 95,
                '4': 90,
                '5': 85,
                '6': 80,
                '7': 75,
                '8': 70,
                '9': 65,
              },
              silgiEvents: [
                {
                  name: '100m',
                  unit: '초',
                  maxScore: 100,
                  gender: 'all',
                },
                {
                  name: '제자리멀리뛰기',
                  unit: 'cm',
                  maxScore: 100,
                  gender: 'all',
                },
                {
                  name: '윗몸일으키기',
                  unit: '개',
                  maxScore: 100,
                  gender: 'all',
                },
              ],
            },
          },
        ],
      },
    },
  });
  console.log('✅ 한국체육대학교 데이터 삽입 완료');

  // 2. 서울대학교 (나군)
  const snu = await prisma.university.create({
    data: {
      name: '서울대학교',
      region: '서울',
      type: '국립',
      departments: {
        create: [
          {
            name: '체육교육과',
            recruitGroup: '나',
            recruitCount: 30,
            year: 2026,
            formula: {
              suneungRatio: 50,
              silgiRatio: 50,
              suneungWeights: {
                korean: 30,
                english: 20,
                math: 0,
                tamgu: 50,
                history: 0,
              },
              suneungTypes: {
                korean: 'standard',
                math: 'standard',
                tamgu: 'standard',
              },
              englishGrades: {
                '1': 100,
                '2': 97,
                '3': 93,
                '4': 88,
                '5': 82,
                '6': 75,
                '7': 67,
                '8': 58,
                '9': 48,
              },
              silgiEvents: [
                {
                  name: '100m',
                  unit: '초',
                  maxScore: 200,
                  gender: 'all',
                },
                {
                  name: '제자리멀리뛰기',
                  unit: 'cm',
                  maxScore: 200,
                  gender: 'all',
                },
                {
                  name: '윗몸일으키기',
                  unit: '개',
                  maxScore: 200,
                  gender: 'all',
                },
              ],
            },
          },
        ],
      },
    },
  });
  console.log('✅ 서울대학교 데이터 삽입 완료');

  // 3. 연세대학교 (다군)
  const yonsei = await prisma.university.create({
    data: {
      name: '연세대학교',
      region: '서울',
      type: '사립',
      departments: {
        create: [
          {
            name: '스포츠응용산업학과',
            recruitGroup: '다',
            recruitCount: 25,
            year: 2026,
            formula: {
              suneungRatio: 45,
              silgiRatio: 55,
              suneungWeights: {
                korean: 30,
                english: 20,
                math: 0,
                tamgu: 50,
                history: 0,
              },
              suneungTypes: {
                korean: 'percentile',
                math: 'percentile',
                tamgu: 'percentile',
              },
              englishGrades: {
                '1': 100,
                '2': 98,
                '3': 94,
                '4': 89,
                '5': 83,
                '6': 76,
                '7': 68,
                '8': 59,
                '9': 49,
              },
              silgiEvents: [
                {
                  name: '100m',
                  unit: '초',
                  maxScore: 150,
                  gender: 'all',
                },
                {
                  name: '제자리멀리뛰기',
                  unit: 'cm',
                  maxScore: 150,
                  gender: 'all',
                },
              ],
            },
          },
        ],
      },
    },
  });
  console.log('✅ 연세대학교 데이터 삽입 완료');

  // 4. 경희대학교 (가군)
  const khu = await prisma.university.create({
    data: {
      name: '경희대학교',
      region: '서울',
      type: '사립',
      departments: {
        create: [
          {
            name: '체육학과',
            recruitGroup: '가',
            recruitCount: 40,
            year: 2026,
            formula: {
              suneungRatio: 40,
              silgiRatio: 60,
              suneungWeights: {
                korean: 25,
                english: 25,
                math: 0,
                tamgu: 50,
                history: 0,
              },
              suneungTypes: {
                korean: 'percentile',
                math: 'percentile',
                tamgu: 'percentile',
              },
              englishGrades: {
                '1': 100,
                '2': 97,
                '3': 94,
                '4': 90,
                '5': 85,
                '6': 79,
                '7': 72,
                '8': 64,
                '9': 55,
              },
              silgiEvents: [
                {
                  name: '100m',
                  unit: '초',
                  maxScore: 120,
                  gender: 'all',
                },
                {
                  name: '제자리멀리뛰기',
                  unit: 'cm',
                  maxScore: 120,
                  gender: 'all',
                },
                {
                  name: '윗몸일으키기',
                  unit: '개',
                  maxScore: 60,
                  gender: 'all',
                },
              ],
            },
          },
          {
            name: '스포츠의학과',
            recruitGroup: '가',
            recruitCount: 20,
            year: 2026,
            formula: {
              suneungRatio: 50,
              silgiRatio: 50,
              suneungWeights: {
                korean: 30,
                english: 30,
                math: 0,
                tamgu: 40,
                history: 0,
              },
              suneungTypes: {
                korean: 'percentile',
                math: 'percentile',
                tamgu: 'percentile',
              },
              englishGrades: {
                '1': 100,
                '2': 97,
                '3': 94,
                '4': 90,
                '5': 85,
                '6': 79,
                '7': 72,
                '8': 64,
                '9': 55,
              },
              silgiEvents: [
                {
                  name: '100m',
                  unit: '초',
                  maxScore: 100,
                  gender: 'all',
                },
                {
                  name: '제자리멀리뛰기',
                  unit: 'cm',
                  maxScore: 100,
                  gender: 'all',
                },
              ],
            },
          },
        ],
      },
    },
  });
  console.log('✅ 경희대학교 데이터 삽입 완료');

  // 5. 중앙대학교 (나군)
  const cau = await prisma.university.create({
    data: {
      name: '중앙대학교',
      region: '서울',
      type: '사립',
      departments: {
        create: [
          {
            name: '스포츠과학부',
            recruitGroup: '나',
            recruitCount: 35,
            year: 2026,
            formula: {
              suneungRatio: 40,
              silgiRatio: 60,
              suneungWeights: {
                korean: 25,
                english: 25,
                math: 0,
                tamgu: 50,
                history: 0,
              },
              suneungTypes: {
                korean: 'percentile',
                math: 'percentile',
                tamgu: 'percentile',
              },
              englishGrades: {
                '1': 100,
                '2': 98,
                '3': 95,
                '4': 91,
                '5': 86,
                '6': 80,
                '7': 73,
                '8': 65,
                '9': 56,
              },
              silgiEvents: [
                {
                  name: '100m',
                  unit: '초',
                  maxScore: 100,
                  gender: 'all',
                },
                {
                  name: '제자리멀리뛰기',
                  unit: 'cm',
                  maxScore: 100,
                  gender: 'all',
                },
                {
                  name: '윗몸일으키기',
                  unit: '개',
                  maxScore: 100,
                  gender: 'all',
                },
              ],
            },
          },
        ],
      },
    },
  });
  console.log('✅ 중앙대학교 데이터 삽입 완료');

  // 통계 출력
  const universityCount = await prisma.university.count();
  const departmentCount = await prisma.department.count();

  console.log('\n=== 시드 데이터 삽입 완료 ===');
  console.log(`대학: ${universityCount}개`);
  console.log(`학과: ${departmentCount}개`);
  console.log('===========================\n');
}

main()
  .catch((e) => {
    console.error('시드 데이터 삽입 실패:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
