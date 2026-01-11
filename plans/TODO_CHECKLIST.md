# Project S - TODO 체크리스트

**작성자:** 민수 (PM)
**작성일:** 2026-01-11
**용도:** 진행 상황 체크용

---

## Phase 0: 준비

### 기획/문서
- [x] 킥오프 회의
- [x] CEO 결정 사항 확인
- [x] 기획서 v3 작성
- [x] 프로젝트 플랜 작성
- [x] API 명세 초안
- [x] DB 스키마 초안
- [x] 화면 흐름도 초안
- [ ] 디자인 시스템 정의

### 코드 분석
- [x] maxjungsi222 코드 분석
  - [x] jungsi.js 데이터 구조 파악
  - [x] jungsical.js 계산 로직 파악
  - [x] silgical.js 계산 로직 파악
- [x] univjungsi 코드 분석
  - [x] 계산 엔진 구조 파악
  - [x] 테스트 케이스 확인 (31개)
  - [x] API 구조 파악
  - [x] 재사용 가능 목록 정리

### 프로젝트 세팅
- [ ] GitHub 레포 생성
- [ ] NestJS 프로젝트 초기화
- [ ] Next.js 프로젝트 초기화
- [ ] Prisma 설정
- [ ] MySQL 스키마 생성
- [ ] 개발 환경 문서화

---

## Phase 1: 정시 MVP

### Backend (NestJS)
- [ ] 프로젝트 구조 세팅
  - [ ] 모듈 구조 정의
  - [ ] 공통 모듈 (auth, common)
  - [ ] Swagger 설정
- [ ] 대학/학과 API
  - [ ] GET /universities
  - [ ] GET /universities/:id/departments/:id
  - [ ] GET /departments/search
- [ ] 수능 점수 계산 API
  - [ ] POST /calculate/suneung
  - [ ] univjungsi 엔진 연동
- [ ] 실기 점수 계산 API
  - [ ] POST /calculate/silgi
  - [ ] univjungsi 엔진 연동
- [ ] 총점 계산 API
  - [ ] POST /calculate/total
  - [ ] POST /calculate/compare
- [ ] 인증 API
  - [ ] 카카오 로그인
  - [ ] 네이버 로그인
  - [ ] JWT 토큰 관리
- [ ] 사용자 API
  - [ ] GET /users/me
  - [ ] POST /users/me/scores
  - [ ] GET /users/me/scores
  - [ ] DELETE /users/me/scores/:id

### Frontend (Next.js)
- [ ] 프로젝트 구조 세팅
  - [ ] App Router 구조
  - [ ] TailwindCSS 설정
  - [ ] Shadcn/ui 설정
- [ ] 공통 컴포넌트
  - [ ] Button
  - [ ] Input
  - [ ] Select
  - [ ] Card
  - [ ] Modal
- [ ] 수능 점수 입력 페이지
  - [ ] 시험 종류 선택
  - [ ] 과목별 점수 입력
  - [ ] 유효성 검사
- [ ] 대학 검색 페이지
  - [ ] 군별 필터
  - [ ] 지역 필터
  - [ ] 검색
  - [ ] 대학 선택
- [ ] 실기 기록 입력 페이지
  - [ ] 성별 선택
  - [ ] 대학별 종목 표시
  - [ ] 기록 입력
- [ ] 결과 페이지
  - [ ] 대학별 점수 비교
  - [ ] 상세 breakdown
  - [ ] 저장 기능
- [ ] 로그인/회원가입
  - [ ] 소셜 로그인 버튼
  - [ ] 인증 상태 관리
- [ ] 마이페이지
  - [ ] 저장된 점수 목록
  - [ ] 설정

### Design
- [ ] 디자인 시스템
  - [ ] 컬러 팔레트
  - [ ] 타이포그래피
  - [ ] 아이콘 세트
- [ ] 모바일 UI 디자인
  - [ ] 수능 입력 화면
  - [ ] 대학 검색 화면
  - [ ] 실기 입력 화면
  - [ ] 결과 화면
- [ ] 다크모드
  - [ ] 다크 컬러 팔레트
  - [ ] 토글 기능

---

## Phase 2: 테스트 + 런칭

### 테스트
- [ ] 단위 테스트
  - [ ] 계산 로직 테스트
  - [ ] API 테스트
- [ ] 통합 테스트
  - [ ] E2E 테스트
- [ ] 계산 정확도 검증
  - [ ] univjungsi 결과와 비교
  - [ ] 100% 일치 확인
- [ ] 보안 점검
  - [ ] 인증/인가 테스트
  - [ ] SQL 인젝션 방어
  - [ ] XSS 방어
- [ ] 성능 테스트
  - [ ] 응답 시간 측정
  - [ ] 동시 접속 테스트

### 배포
- [ ] 프로덕션 환경 준비
  - [ ] Vercel 설정
  - [ ] 백엔드 서버 설정
  - [ ] 도메인 연결
- [ ] CI/CD 설정
  - [ ] GitHub Actions
  - [ ] 자동 배포
- [ ] 모니터링
  - [ ] 에러 트래킹
  - [ ] 로그 수집
- [ ] 랜딩페이지
  - [ ] 디자인 (글래스)
  - [ ] 개발
  - [ ] 배포

---

## Phase 3: 수시 계산기

- [ ] 내신 입력 UI
- [ ] 내신 환산 API
- [ ] 수시 전형 필터
- [ ] 수능 최저 체크
- [ ] 6개 대학 조합

---

## Phase 4: 실기 다이어리

- [ ] 기록 히스토리 API
- [ ] 성장 그래프 UI
- [ ] 목표 설정
- [ ] 합격 예측 알고리즘
- [ ] 합격 예측 UI

---

## Phase 5: 수익화

- [ ] 토스페이먼츠 연동
- [ ] 구독 관리 API
- [ ] 프리미엄 기능 제한
- [ ] 결제 UI

---

## 기타

### 문서
- [ ] README 업데이트
- [ ] API 문서 완성
- [ ] 사용자 가이드

### 마케팅
- [ ] 서비스명 확정
- [ ] 로고 제작
- [ ] SNS 홍보

---

**최종 업데이트:** 2026-01-11
**담당:** 민수 (PM)
