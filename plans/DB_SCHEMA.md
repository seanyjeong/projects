# Project S - DB 스키마 초안

**작성자:** 영철 (Architect)
**작성일:** 2026-01-11
**버전:** Draft 0.1
**DB:** MySQL + Prisma

---

## ERD 개요

```
┌─────────────────────────────────────────────────────────────────┐
│                         ERD 다이어그램                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────┐      ┌──────────────┐      ┌──────────────┐      │
│  │   User   │──1:N─│  UserScore   │      │  University  │      │
│  └──────────┘      └──────────────┘      └──────────────┘      │
│       │                                        │                │
│       │                                       1:N               │
│      1:N                                       │                │
│       │            ┌──────────────┐      ┌──────────────┐      │
│       │            │ DiaryRecord  │      │  Department  │      │
│       └────────────│              │      └──────────────┘      │
│                    └──────────────┘            │                │
│                                               1:1               │
│                                                │                │
│                                         ┌──────────────┐       │
│                                         │FormulaConfig │       │
│                                         └──────────────┘       │
│                                                │                │
│                                               1:N               │
│                                                │                │
│                                         ┌──────────────┐       │
│                                         │  SilgiEvent  │       │
│                                         └──────────────┘       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 1. User (사용자)

```prisma
model User {
  id            String      @id @default(cuid())
  email         String      @unique
  name          String?
  provider      String      // kakao, naver
  providerId    String
  plan          Plan        @default(FREE)
  planExpiresAt DateTime?

  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt

  scores        UserScore[]
  diaryRecords  DiaryRecord[]

  @@unique([provider, providerId])
  @@map("users")
}

enum Plan {
  FREE
  PREMIUM
  PRO
}
```

---

## 2. University (대학)

```prisma
model University {
  id          String       @id @default(cuid())
  name        String
  region      String

  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt

  departments Department[]

  @@map("universities")
}
```

---

## 3. Department (학과)

```prisma
model Department {
  id              String         @id @default(cuid())
  universityId    String
  university      University     @relation(fields: [universityId], references: [id])

  name            String         // 학과명
  year            Int            // 입시년도 (2027)
  admissionType   AdmissionType  // 정시/수시
  admissionGroup  String?        // 가/나/다 (정시만)
  admissionMethod String?        // 실기위주/학생부교과/종합 (수시만)

  capacity        Int            // 모집인원
  suneungRatio    Decimal        // 수능 비율
  silgiRatio      Decimal        // 실기 비율
  naesinRatio     Decimal?       // 내신 비율 (수시)

  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt

  formulaConfig   FormulaConfig?
  silgiEvents     SilgiEvent[]

  @@unique([universityId, name, year, admissionType])
  @@map("departments")
}

enum AdmissionType {
  JUNGSI    // 정시
  SUSI      // 수시
}
```

---

## 4. FormulaConfig (계산 공식 설정)

```prisma
model FormulaConfig {
  id              String     @id @default(cuid())
  departmentId    String     @unique
  department      Department @relation(fields: [departmentId], references: [id])

  // 수능 과목별 비율
  koreanRatio     Decimal    @default(0)
  mathRatio       Decimal    @default(0)
  englishRatio    Decimal    @default(0)
  tamguRatio      Decimal    @default(0)
  historyRatio    Decimal    @default(0)

  // 반영 방식
  koreanType      ScoreType  @default(PERCENTILE)  // 표준점수/백분위
  mathType        ScoreType  @default(PERCENTILE)
  tamguType       ScoreType  @default(PERCENTILE)

  // 등급표 (JSON)
  englishGrades   Json       // {"1": 100, "2": 98, ...}
  historyGrades   Json       // {"1": 10, "2": 10, ...}

  // 특수 공식 (하드코딩 필요한 경우)
  specialFormula  String?

  createdAt       DateTime   @default(now())
  updatedAt       DateTime   @updatedAt

  @@map("formula_configs")
}

enum ScoreType {
  STANDARD    // 표준점수
  PERCENTILE  // 백분위
}
```

---

## 5. SilgiEvent (실기 종목)

```prisma
model SilgiEvent {
  id            String     @id @default(cuid())
  departmentId  String
  department    Department @relation(fields: [departmentId], references: [id])

  name          String     // 종목명 (100m, 제자리멀리뛰기)
  unit          String     // 단위 (초, cm, m, 개)
  maxScore      Decimal    // 만점

  // 배점표 (JSON)
  maleTable     Json       // [{"record": 11.0, "score": 100}, ...]
  femaleTable   Json       // [{"record": 12.0, "score": 100}, ...]

  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt

  @@map("silgi_events")
}
```

---

## 6. UserScore (사용자 저장 점수)

```prisma
model UserScore {
  id            String    @id @default(cuid())
  userId        String
  user          User      @relation(fields: [userId], references: [id])

  name          String    // "9월 모의고사", "본수능"
  examType      ExamType

  // 수능 점수 (JSON)
  suneungScores Json      // 전체 수능 점수 객체

  // 실기 기록 (JSON)
  silgiRecords  Json      // 전체 실기 기록 객체

  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  @@map("user_scores")
}

enum ExamType {
  MARCH       // 3월 모의
  JUNE        // 6월 모의
  SEPTEMBER   // 9월 모의
  SUNEUNG     // 본수능
}
```

---

## 7. DiaryRecord (실기 다이어리)

```prisma
model DiaryRecord {
  id          String    @id @default(cuid())
  userId      String
  user        User      @relation(fields: [userId], references: [id])

  date        DateTime
  eventName   String    // 종목명
  record      Decimal   // 기록
  memo        String?   // 메모

  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@index([userId, eventName])
  @@index([userId, date])
  @@map("diary_records")
}
```

---

## 8. Subscription (구독) - Phase 5

```prisma
model Subscription {
  id            String    @id @default(cuid())
  userId        String    @unique

  plan          Plan
  status        SubStatus

  startDate     DateTime
  endDate       DateTime

  // 결제 정보
  paymentKey    String?
  orderId       String?

  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  @@map("subscriptions")
}

enum SubStatus {
  ACTIVE
  CANCELLED
  EXPIRED
}
```

---

## 9. ChangeLog (변경 이력)

```prisma
model ChangeLog {
  id          String    @id @default(cuid())

  tableName   String
  recordId    String
  action      String    // CREATE, UPDATE, DELETE
  oldValue    Json?
  newValue    Json?
  changedBy   String

  createdAt   DateTime  @default(now())

  @@index([tableName, recordId])
  @@map("change_logs")
}
```

---

## 인덱스 전략

```sql
-- 자주 사용되는 쿼리용 인덱스
CREATE INDEX idx_dept_year_type ON departments(year, admission_type);
CREATE INDEX idx_dept_group ON departments(admission_group);
CREATE INDEX idx_user_scores_user ON user_scores(user_id);
CREATE INDEX idx_diary_user_event ON diary_records(user_id, event_name);
```

---

## univjungsi 기존 테이블 참조

기존 `univjungsi` DB 테이블 재사용 가능:
- `formula_configs` → 수능 비율/등급표
- `silgi_tables` → 실기 배점표
- `change_logs` → 변경 이력

**마이그레이션 필요:**
- User 테이블 신규
- Subscription 테이블 신규

---

**작성:** 영철 (Architect)
**상태:** Draft - 검토 필요
