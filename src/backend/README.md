# Project S Backend

체대 입시 계산 SaaS의 백엔드 API 서버입니다.

## 빠른 시작

```bash
# 패키지 설치
npm install

# 환경변수 설정
cp .env.example .env

# Prisma 설정
npm run prisma:push
npm run prisma:generate

# 개발 서버 실행
npm run start:dev
```

서버: http://localhost:3001
Swagger 문서: http://localhost:3001/api

## 기술 스택

- NestJS 10 + TypeScript
- MySQL + Prisma ORM
- JWT 인증 (Passport)
- Swagger API 문서

## 문서

자세한 내용은 [CLAUDE.md](./CLAUDE.md)를 참조하세요.

## 프로젝트 구조

```
src/
├── auth/          # 인증 (JWT)
├── user/          # 사용자 관리
├── university/    # 대학/학과
├── calculator/    # 점수 계산 엔진
└── prisma/        # DB 연결
```

## 개발

```bash
npm run start:dev     # 개발 서버
npm run build         # 빌드
npm run test          # 테스트
npm run lint          # Lint
```
