# Project S Backend (NestJS)

> 체대 입시 계산 SaaS의 백엔드 API 서버

## 개요

체대 수험생을 위한 정시/수시 점수 계산 서비스의 백엔드 API입니다.

- **프레임워크**: NestJS 10 + TypeScript
- **DB**: MySQL + Prisma ORM
- **인증**: JWT (Passport)
- **API 문서**: Swagger (자동 생성)

---

## 디렉토리 구조

```
src/
├── main.ts                      # 앱 진입점
├── app.module.ts                # 루트 모듈
├── app.controller.ts            # Health check
├── app.service.ts
│
├── auth/                        # 인증 모듈
│   ├── auth.module.ts
│   ├── auth.controller.ts       # /auth/login, /auth/register
│   ├── auth.service.ts
│   ├── dto/                     # LoginDto, RegisterDto
│   ├── guards/                  # JwtAuthGuard, LocalAuthGuard
│   └── strategies/              # JWT, Local 전략
│
├── user/                        # 사용자 모듈
│   ├── user.module.ts
│   ├── user.controller.ts       # /user/me
│   ├── user.service.ts
│   └── dto/                     # UpdateUserDto
│
├── university/                  # 대학/학과 모듈
│   ├── university.module.ts
│   ├── university.controller.ts # /universities, /universities/:id
│   └── university.service.ts
│
├── calculator/                  # 계산 모듈
│   ├── calculator.module.ts
│   ├── calculator.controller.ts # /calculator/suneung, /calculator/practical
│   ├── calculator.service.ts
│   ├── dto/                     # CalculateDto
│   │
│   ├── suneung/                 # 수능 계산 엔진 (from univjungsi)
│   ├── practical/               # 실기 계산 엔진 (from univjungsi)
│   ├── utils/                   # 공통 유틸
│   └── types.ts                 # 계산 엔진 타입
│
└── prisma/                      # Prisma 모듈
    ├── prisma.module.ts
    └── prisma.service.ts

prisma/
└── schema.prisma                # DB 스키마
```

---

## 빠른 시작

### 1. 패키지 설치
```bash
npm install
```

### 2. 환경변수 설정
```bash
cp .env.example .env
# .env 파일에서 DATABASE_URL, JWT_SECRET 수정
```

### 3. DB 마이그레이션
```bash
npm run prisma:push        # schema.prisma → DB 반영
npm run prisma:generate    # Prisma Client 생성
```

### 4. 개발 서버 실행
```bash
npm run start:dev
```

서버: http://localhost:3001
Swagger: http://localhost:3001/api

---

## 주요 명령어

```bash
# 개발
npm run start:dev          # Hot-reload 개발 서버
npm run start:debug        # 디버그 모드

# 빌드
npm run build              # 프로덕션 빌드
npm run start:prod         # 프로덕션 실행

# 테스트
npm test                   # Jest 테스트
npm run test:watch         # watch 모드
npm run test:cov           # 커버리지

# Prisma
npm run prisma:generate    # Prisma Client 재생성
npm run prisma:push        # 스키마 → DB 동기화
npm run prisma:studio      # Prisma Studio (DB GUI)

# 코드 품질
npm run lint               # ESLint
npm run format             # Prettier
```

---

## API 엔드포인트

### Health Check
- `GET /` - 서버 상태 확인

### 인증 (Auth)
- `POST /auth/register` - 회원가입
- `POST /auth/login` - 로그인
- `POST /auth/refresh` - 토큰 갱신 (인증 필요)

### 사용자 (User)
- `GET /user/me` - 내 정보 조회 (인증 필요)
- `PATCH /user/me` - 내 정보 수정 (인증 필요)

### 대학/학과 (University)
- `GET /universities` - 대학 목록
- `GET /universities/:id` - 대학 상세
- `GET /universities/:id/departments` - 학과 목록

### 계산 (Calculator)
- `POST /calculator/suneung` - 수능 점수 계산
- `POST /calculator/practical` - 실기 점수 계산

**상세 API 문서**: http://localhost:3001/api (Swagger)

---

## 계산 엔진

### 복사 경로
`/home/sean/univjungsi/src/lib/calculator/` → `src/calculator/`

### 포함된 모듈
- **suneung/**: 수능 계산 로직 (13 tests)
- **practical/**: 실기 계산 로직 (18 tests)
- **utils/**: 등급컷 보간, 파싱 유틸
- **types.ts**: 타입 정의

### 사용 방법
```typescript
import { calculateScore, calculatePracticalScore } from './calculator';

// 수능 계산
const result = calculateScore(studentScores, formulaData);

// 실기 계산
const practicalResult = calculatePracticalScore(practicalData, formulaData);
```

---

## DB 스키마

### 주요 테이블
- **users**: 사용자 (이메일, 비밀번호, 역할)
- **universities**: 대학 (이름, 지역, 유형)
- **departments**: 학과 (대학ID, 학과명, 모집군, 모집인원, **formula JSON**)
- **calculations**: 계산 내역 (사용자ID, 학과ID, 입력/결과 JSON)
- **change_logs**: 변경 이력 (테이블명, 레코드ID, 이전/이후 데이터)

### JSON 필드
- `departments.formula`: FormulaData 타입 (수능 비율, 실기 배점 등)
- `calculations.inputData`: 학생 입력 점수
- `calculations.resultData`: 계산 결과

---

## 인증 시스템

### JWT 토큰 방식
1. `/auth/login` → `access_token` 발급
2. 요청 헤더: `Authorization: Bearer <token>`
3. `@UseGuards(JwtAuthGuard)` 데코레이터로 보호

### 역할 (Role)
- `USER`: 일반 사용자
- `ADMIN`: 관리자

---

## 환경 변수

```bash
# Database
DATABASE_URL="mysql://paca@localhost:3306/project_s"

# JWT
JWT_SECRET="project-s-secret-key-2026"
JWT_EXPIRES_IN="7d"

# Server
PORT=3001
NODE_ENV=development

# Frontend
FRONTEND_URL="http://localhost:3000"

# Current Year
CURRENT_YEAR=2026
```

---

## 개발 가이드

### 새 모듈 추가
```bash
nest g module <module-name>
nest g controller <module-name>
nest g service <module-name>
```

### DTO 작성
```typescript
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';

export class CreateDto {
  @ApiProperty({ example: 'example' })
  @IsString()
  name: string;

  @ApiProperty({ example: 100 })
  @IsNumber()
  score: number;
}
```

### 인증 가드 사용
```typescript
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Get('protected')
async protectedRoute(@Request() req) {
  return req.user; // { id, email, role }
}
```

---

## 배포

### 빌드
```bash
npm run build
```

### 프로덕션 실행
```bash
npm run start:prod
```

### PM2 (권장)
```bash
pm2 start dist/main.js --name project-s-backend
pm2 save
pm2 startup
```

---

## TODO

- [ ] Calculator 서비스에 univjungsi 엔진 통합
- [ ] 실제 계산 로직 구현 (현재 placeholder)
- [ ] 계산 내역 저장 기능
- [ ] Admin 전용 API (학과 데이터 관리)
- [ ] 엑셀 업로드/다운로드 API
- [ ] 변경 이력 조회 API
- [ ] 테스트 코드 작성

---

## 참고

- **NestJS 공식 문서**: https://docs.nestjs.com
- **Prisma 공식 문서**: https://www.prisma.io/docs
- **원본 계산 엔진**: `/home/sean/univjungsi/src/lib/calculator/`
- **프론트엔드**: `/home/sean/project-s/src/frontend/` (TODO)

---

**Last Updated**: 2026-01-11
**Version**: 1.0.0
