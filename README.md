# Project S

> 체대 입시 계산 SaaS

## 개요

체대 수험생을 위한 정시 + 수시 점수 계산 서비스

## 폴더 구조

```
project-s/
├── README.md              # 본 문서
├── docs/                  # 기획 문서
│   ├── 체대입시-SaaS-기획보고서-v3.md
│   └── kickoff-체대입시-SaaS-2026-01-11.md
├── plans/                 # 프로젝트 플랜
│   └── PROJECT_PLAN.md
├── references/            # 참고 자료
│   └── project_s_v2.md
└── src/                   # 소스코드 (개발 시작 시)
    ├── frontend/          # Next.js
    └── backend/           # NestJS
```

## 기술 스택

| 영역 | 기술 |
|------|------|
| Frontend | Next.js 15 + TypeScript + TailwindCSS |
| Backend | NestJS + TypeScript |
| DB | MySQL + Prisma |
| 인프라 | Vercel + 기존 서버 |

## 관련 코드베이스

| 경로 | 설명 |
|------|------|
| `/home/sean/maxjungsi222/` | 현재 프로덕션 (HTML/JS) |
| `/home/sean/univjungsi/` | 리팩토링 버전 (계산 엔진 31 tests) |

## 문서

- [기획서 v3](docs/체대입시-SaaS-기획보고서-v3.md)
- [킥오프 회의록](docs/kickoff-체대입시-SaaS-2026-01-11.md)
- [프로젝트 플랜](plans/PROJECT_PLAN.md)

## 팀

| 역할 | 담당 |
|------|------|
| CEO | Sean |
| PM | 민수 |
| Architect | 영철 |
| Builder | 동현 |
| Guardian | 은지 |
| Designer | 민지, 글래스 |

## 현재 상태

- **Phase:** 0 (준비)
- **다음 단계:** 기존 코드 분석, 프로젝트 세팅

---

**승인:** Sean CEO (2026-01-11)
