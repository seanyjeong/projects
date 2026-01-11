# Project S - 재사용 가능 모듈 목록

**작성자:** 영철 (Architect)
**작성일:** 2026-01-11
**목적:** NestJS 마이그레이션 시 재사용할 코드 정리

---

## 요약

| 소스 | 재사용률 | 예상 작업량 |
|------|---------|------------|
| univjungsi/calculator | **95%** | 거의 복붙 |
| univjungsi/types | **100%** | 그대로 사용 |
| univjungsi/tests | **90%** | 경로만 수정 |
| maxjungsi222 로직 | 참고용 | 이미 univjungsi에 포팅됨 |

---

## 1. 100% 재사용 (복사만 하면 됨)

### 1.1 계산 엔진 타입 정의

```
소스: univjungsi/src/lib/calculator/types.ts
대상: project-s/src/calculator/types.ts
작업: 그대로 복사
```

**포함 내용:**
- FormulaConfig 인터페이스
- StudentScores 인터페이스
- PracticalRecord 인터페이스
- 등급 환산표 타입
- 선택 규칙 타입

### 1.2 유틸리티 함수

```
소스: univjungsi/src/lib/calculator/utils/index.ts
대상: project-s/src/calculator/utils/index.ts
작업: 그대로 복사
```

**포함 함수:**
- safeParse() - JSON 안전 파싱
- pickByType() - 표준/백분위 선택
- guessInquiryGroup() - 탐구 분류
- mapPercentileToConverted() - 변환표준 매핑

---

## 2. 95% 재사용 (import 경로만 수정)

### 2.1 수능 계산 엔진

```
소스: univjungsi/src/lib/calculator/suneung/index.ts
대상: project-s/src/calculator/suneung/index.ts
작업: import 경로 수정
```

**핵심 함수:**
```typescript
// 그대로 사용
export function calculateSuneungScore(
  formula: FormulaConfig,
  scores: StudentScores,
  highestMap: HighestScoreMap | null
): CalculationResult

// 그대로 사용
function buildSpecialContext(...)
function evaluateSpecialFormula(...)
function normalizeScore(...)
function applyBonusRules(...)
```

### 2.2 실기 계산 엔진

```
소스: univjungsi/src/lib/calculator/practical/index.ts
대상: project-s/src/calculator/practical/index.ts
작업: import 경로 수정
```

**핵심 함수:**
```typescript
// 그대로 사용
export function calculatePracticalScore(
  formula: FormulaConfig,
  records: PracticalRecord[],
  gender: 'male' | 'female'
): PracticalResult

// 그대로 사용
function lookupScore(...)
function getEventRules(...)
function handleSpecialCases(...)
```

---

## 3. 90% 재사용 (경로 + 약간 수정)

### 3.1 테스트 케이스

```
소스: univjungsi/src/lib/calculator/suneung/index.test.ts
      univjungsi/src/lib/calculator/practical/index.test.ts
대상: project-s/src/calculator/**/*.spec.ts
작업: 파일명 .test.ts → .spec.ts
      import 경로 수정
```

**테스트 목록 (31개):**
- 수능 테스트 13개
- 실기 테스트 18개

---

## 4. 60% 재사용 (리팩토링 필요)

### 4.1 API 로직

```
소스: univjungsi/src/app/api/calculate/suneung/route.ts
대상: project-s/src/jungsical/jungsical.controller.ts
작업: Next.js API Route → NestJS Controller 변환
```

**변환 예시:**
```typescript
// Before (Next.js)
export async function POST(request: Request) {
  const body = await request.json();
  const result = calculateSuneungScore(...);
  return NextResponse.json(result);
}

// After (NestJS)
@Controller('calculate')
export class CalculateController {
  @Post('suneung')
  async suneung(@Body() dto: SuneungDto) {
    return this.service.calculateSuneungScore(...);
  }
}
```

### 4.2 엑셀 처리

```
소스: univjungsi/src/app/api/export/excel/route.ts
      univjungsi/src/app/api/import/excel/route.ts
대상: project-s/src/excel/excel.service.ts
작업: xlsx 라이브러리 로직 재사용
      NestJS 파일 업로드 처리로 변환
```

---

## 5. 새로 작성 필요

### 5.1 NestJS 모듈 구조

```typescript
// 새로 작성
@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [JungsicalController, SilgicalController],
  providers: [JungsicalService, SilgicalService],
})
export class CalculatorModule {}
```

### 5.2 인증 (Passport.js)

```typescript
// 새로 작성
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }
}
```

### 5.3 Prisma 스키마

```prisma
// 새로 작성 (DB_SCHEMA.md 기반)
model Department {
  id              String  @id @default(cuid())
  universityId    String
  name            String
  // ...
}
```

---

## 6. 마이그레이션 체크리스트

### Phase 0 (완료)
- [x] 코드 분석 완료
- [x] 재사용 가능 목록 정리

### Phase 1 (다음)
- [ ] NestJS 프로젝트 생성
- [ ] 폴더 구조 생성
- [ ] calculator/ 모듈 복사
- [ ] 테스트 실행 확인

### Phase 2
- [ ] Prisma 스키마 작성
- [ ] DB 마이그레이션
- [ ] Repository 구현

### Phase 3
- [ ] Controller 작성
- [ ] Service 래핑
- [ ] Swagger 문서화

---

## 7. 파일 복사 명령어

```bash
# 1. NestJS 프로젝트 생성
cd /home/sean/project-s/src
nest new backend

# 2. calculator 모듈 복사
mkdir -p backend/src/calculator
cp -r /home/sean/univjungsi/src/lib/calculator/* backend/src/calculator/

# 3. 타입 정의 복사
cp /home/sean/univjungsi/src/lib/calculator/types.ts backend/src/calculator/

# 4. 테스트 복사 (경로 수정 필요)
cp /home/sean/univjungsi/src/lib/calculator/suneung/index.test.ts \
   backend/src/calculator/suneung/suneung.service.spec.ts

cp /home/sean/univjungsi/src/lib/calculator/practical/index.test.ts \
   backend/src/calculator/practical/practical.service.spec.ts
```

---

## 8. 예상 작업 시간

| 작업 | 시간 |
|------|------|
| 계산 엔진 복사 + 수정 | 2시간 |
| 테스트 이식 | 1시간 |
| Controller 작성 | 4시간 |
| Prisma 설정 | 2시간 |
| 인증 구현 | 4시간 |
| Swagger 문서화 | 2시간 |
| **합계** | **15시간 (2일)** |

---

**작성:** 영철 (Architect)
**결론:** univjungsi 계산 엔진은 거의 그대로 사용 가능. NestJS 래핑만 하면 됨.
