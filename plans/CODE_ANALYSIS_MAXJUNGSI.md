# maxjungsi222 프로덕션 코드 분석

**작성자:** 영철 (Architect)
**작성일:** 2026-01-11
**분석 대상:** /home/sean/maxjungsi222/

---

## 1. 폴더 구조

```
maxjungsi222/
├── jungsi.js              # 메인 Express 서버 (인증, 라우팅)
├── jungsical.js           # 정시 점수 계산 로직 (51KB)
├── silgical.js            # 실기 점수 계산 로직 (31KB)
├── 26susi.js              # 수능 DB/API (168KB)
├── maxjungsi-next/        # Next.js 프론트엔드 (관리자)
└── [HTML 파일들]          # 관리자 UI
    ├── calculator.html    # 점수 계산기
    ├── setting.html       # 대학 설정
    └── final_apply.html   # 최종 지원
```

---

## 2. 데이터베이스 구조

### 주요 테이블

| 테이블 | 용도 | 주요 컬럼 |
|--------|------|----------|
| `정시기본` | 대학/학과 정보 | U_ID, 학년도, 대학명, 학과명, 군, 모집정원 |
| `정시반영비율` | 점수 계산식 | U_ID, 수능, 실기, 국어, 수학, 영어, 탐구, english_scores, 특수공식 |
| `정시실기배점` | 실기 배점표 | U_ID, 종목명, 기록, 배점, 성별 |
| `정시탐구변환표준` | 탐구 변환 | 계열, 백분위, 변환표준점수 |
| `정시최고표점` | 최고표점 맵 | 모형, 과목명, 최고점 |

---

## 3. 정시 계산 로직 (jungsical.js)

### 계산 흐름 5단계

```
1. 원점수 결정 (Source Type)
   ├─ 국어/수학: std (표준점수) or pct (백분위)
   ├─ 영어: grade_conv (등급 → 환산점수)
   ├─ 탐구: std / pct / conv_std (변환표준점수)
   └─ 한국사: grade_conv or bonus/deduction

2. 정규화 (Normalization)
   ├─ fixed_100: 100점 만점
   ├─ fixed_200: 200점 만점
   ├─ highest_of_year: 해당연도 최고점
   └─ conv_table_max: 변환표 최고점

3. 선택 규칙 (Selection Rules)
   ├─ select_n: N개 선택 (상위)
   └─ select_ranked_weights: 가중치 적용

4. 가중합 (Weighted Sum)
   └─ 최종 = Σ(정규화점수 × 반영비율) × 총점 × 수능비율

5. 가산점 (Bonus)
   ├─ 영어 등급별 가산
   ├─ 한국사 등급별 가/감점
   ├─ 수학 선택과목 가산 (미적분/기하 +10%)
   └─ 탐구 사탐 가산 (+5%)
```

### 핵심 함수

```javascript
calculateScore(formulaDataRaw, studentScores, highestMap)
├─ buildSpecialContext()    // 특수공식용 변수 50개+
├─ evaluateSpecialFormula() // 수식 동적 계산
├─ detectEnglishAsBonus()   // 영어 가산점 판단
├─ calcInquiryRepresentative() // 탐구 상위 N개
└─ resolveMaxScores()       // 과목별 최고점
```

### 특수공식 변수 (buildSpecialContext)

```javascript
// 기본
ctx.total, ctx.suneung_ratio

// 국/수 (표준점수/백분위)
ctx.kor_std, ctx.kor_pct, ctx.kor_max
ctx.math_std, ctx.math_pct, ctx.math_max

// 탐구
ctx.inq1_std, ctx.inq2_std, ctx.inq1_percentile
ctx.inq1_converted_std, ctx.inq_sum2_converted_std

// 영어/한국사
ctx.eng_grade_score, ctx.eng_max
ctx.hist_grade_score

// 가산점
ctx.math_bonus_pct_10, ctx.inq1_social_boost

// 복합 계산 (상위 N개 조합)
ctx.top2_sum_scaled_kme
ctx.top3_sum_std_kme_inq1_doubled
```

---

## 4. 실기 계산 로직 (silgical.js)

### 계산 흐름

```
입력: F_data (대학 설정), S_data (학생 기록)
  ↓
1. 종목명 분석 → higher_is_better / lower_is_better
2. 배점표 매칭 → 학생 기록 → 등급 결정
3. 점수 변환 → P=100, NP=0, 숫자=그대로
4. 합산 (Basic/Special 모드)
5. 최종 점수 반환
```

### 배점 룩업 규칙 (우선순위)

```
1순위: 정확한 문자 일치 (P/F 등)
2순위: 범위 조건 (N 이상/이하)
3순위: 숫자 비교 (정렬 후 매칭)
4순위: 미달처리 (최하점 또는 0점)

특수: F/G/미응시/파울/실격 → 자동 최하점
```

---

## 5. 특수 공식 대학 목록 (하드코딩)

### 정시 특수 케이스

| U_ID | 대학명 | 계산 방식 |
|------|--------|---------|
| 148, 149 | 선문대 | 등급 기반 상위 2개 |
| 76 | 경동대 | 4과목 등급 평균 → 자체 등급표 |

### 실기 특수 케이스

| U_ID | 계산 방식 |
|------|---------|
| 2, 3 | 배점 합 → 룩업표/기본점수 |
| 13 | 선형 정규화 |
| 16, 17 | 종목별 가중치 합산 |
| 19 | 배점 합 + 기본점수 |
| 69, 70 | 평균 × 4 + 400 |
| 99, 146, 147 | 상위 3종목 환산 |
| 121 | PASS 카운팅 × 100 |
| 151, 152, 153 | 종목 평균 공식 |
| 160, 175 | 가중치 + 환산 |
| 184, 186 | 비율 환산 |
| 189, 194, 197, 199 | 배점 합 × 계수 |

---

## 6. NestJS 마이그레이션 계획

### 아키텍처 매핑

```
Express (현재)              →  NestJS (목표)

jungsi.js                  →  AppModule
  ├─ authMiddleware        →  @UseGuards(AuthGuard)
  ├─ jungsicalRouter       →  JungsicalModule
  └─ silgicalRouter        →  SilgicalModule

jungsical.js               →  JungsicalService
silgical.js                →  SilgicalService
```

### 마이그레이션 체크리스트

```bash
# Phase 1: 모듈 생성
nest g module jungsical
nest g service jungsical
nest g controller jungsical

nest g module silgical
nest g service silgical
nest g controller silgical

# Phase 2: 계산 로직 이식 (90% 재사용)
# Phase 3: 라우트 변환
# Phase 4: 테스트 작성
```

### 개선 포인트

| 현재 이슈 | NestJS 해결책 |
|----------|-------------|
| 매번 DB 로드 | Redis 캐싱 |
| Function() 평가 | mathjs 파서 |
| 반복 JSON.parse | class-validator |
| 동기 DB 쿼리 | async/await |

---

## 7. 재사용 가능 부분

### ✅ 그대로 이식 가능 (90%)

1. **buildSpecialContext()** - 변수 자동 생성 패턴
2. **evaluateSpecialFormula()** - 수식 파서
3. **calcInquiryRepresentative()** - 상위 N개 선택
4. **lookupScore()** - 배점 룩업 엔진

### ⚠️ 리팩토링 필요 (10%)

1. U_ID 하드코딩 → DB 설정 기반
2. Function() 평가 → 안전한 파서
3. 반복 DB 쿼리 → 배치 처리

---

## 8. 결론

**재사용성: 90%** - 계산 로직 핵심은 거의 그대로 사용 가능

**주요 작업:**
1. NestJS 구조로 래핑
2. 하드코딩된 U_ID 규칙 → DB 설정화
3. 테스트 케이스 추가

---

**작성:** 영철 (Architect)
