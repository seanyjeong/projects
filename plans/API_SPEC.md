# Project S - API 명세 초안

**작성자:** 영철 (Architect)
**작성일:** 2026-01-11
**버전:** Draft 0.1

---

## Base URL

```
Production: https://api.project-s.kr
Development: http://localhost:3001
```

---

## 1. 인증 API

### 1.1 소셜 로그인

```
POST /auth/kakao
POST /auth/naver
```

**Response:**
```json
{
  "accessToken": "string",
  "refreshToken": "string",
  "user": {
    "id": "string",
    "email": "string",
    "name": "string",
    "plan": "free | premium"
  }
}
```

### 1.2 토큰 갱신

```
POST /auth/refresh
```

### 1.3 로그아웃

```
POST /auth/logout
```

---

## 2. 대학/학과 API

### 2.1 대학 목록 조회

```
GET /universities
```

**Query Parameters:**
| 파라미터 | 타입 | 설명 |
|----------|------|------|
| year | number | 입시년도 (기본: 2027) |
| type | string | 정시/수시 |
| group | string | 가/나/다군 (정시) |
| region | string | 지역 필터 |

**Response:**
```json
{
  "universities": [
    {
      "id": "string",
      "name": "서울대학교",
      "region": "서울",
      "departments": [...]
    }
  ]
}
```

### 2.2 학과 상세 조회

```
GET /universities/:univId/departments/:deptId
```

**Response:**
```json
{
  "id": "string",
  "universityName": "서울대학교",
  "departmentName": "체육교육과",
  "admissionType": "정시",
  "group": "가",
  "capacity": 30,
  "suneungRatio": 40,
  "silgiRatio": 60,
  "suneungWeights": {
    "korean": 30,
    "english": 20,
    "math": 0,
    "tamgu": 50
  },
  "englishGradeTable": {
    "1": 100, "2": 98, "3": 95, ...
  },
  "silgiEvents": [
    {
      "name": "100m",
      "unit": "초",
      "maxScore": 100
    }
  ]
}
```

### 2.3 학과 검색

```
GET /departments/search
```

**Query Parameters:**
| 파라미터 | 타입 | 설명 |
|----------|------|------|
| q | string | 검색어 |
| year | number | 입시년도 |
| type | string | 정시/수시 |
| group | string | 가/나/다 |

---

## 3. 점수 계산 API

### 3.1 수능 점수 계산

```
POST /calculate/suneung
```

**Request:**
```json
{
  "departmentId": "string",
  "scores": {
    "korean": {
      "standard": 130,
      "percentile": 95,
      "grade": 2
    },
    "math": {
      "standard": 125,
      "percentile": 90,
      "grade": 2
    },
    "english": {
      "grade": 2
    },
    "tamgu1": {
      "subject": "생활과윤리",
      "standard": 65,
      "percentile": 92,
      "grade": 2
    },
    "tamgu2": {
      "subject": "사회문화",
      "standard": 62,
      "percentile": 88,
      "grade": 2
    },
    "history": {
      "grade": 3
    }
  }
}
```

**Response:**
```json
{
  "departmentId": "string",
  "suneungScore": 385.5,
  "maxScore": 400,
  "details": {
    "korean": 115.5,
    "english": 98,
    "tamgu": 172
  }
}
```

### 3.2 실기 점수 계산

```
POST /calculate/silgi
```

**Request:**
```json
{
  "departmentId": "string",
  "gender": "male | female",
  "records": [
    {
      "eventName": "100m",
      "record": 11.5
    },
    {
      "eventName": "제자리멀리뛰기",
      "record": 285
    }
  ]
}
```

**Response:**
```json
{
  "departmentId": "string",
  "silgiScore": 580,
  "maxScore": 600,
  "details": [
    {
      "eventName": "100m",
      "record": 11.5,
      "score": 95
    }
  ]
}
```

### 3.3 총점 계산

```
POST /calculate/total
```

**Request:**
```json
{
  "departmentId": "string",
  "suneungScores": { ... },
  "silgiRecords": [ ... ],
  "gender": "male"
}
```

**Response:**
```json
{
  "departmentId": "string",
  "universityName": "서울대학교",
  "departmentName": "체육교육과",
  "totalScore": 965.5,
  "maxScore": 1000,
  "breakdown": {
    "suneung": {
      "score": 385.5,
      "max": 400,
      "ratio": 40
    },
    "silgi": {
      "score": 580,
      "max": 600,
      "ratio": 60
    }
  }
}
```

### 3.4 여러 대학 비교 계산

```
POST /calculate/compare
```

**Request:**
```json
{
  "departmentIds": ["id1", "id2", "id3"],
  "suneungScores": { ... },
  "silgiRecords": [ ... ],
  "gender": "male"
}
```

**Response:**
```json
{
  "results": [
    {
      "departmentId": "id1",
      "universityName": "서울대",
      "totalScore": 965.5,
      "rank": 1
    },
    ...
  ]
}
```

---

## 4. 사용자 API

### 4.1 내 정보 조회

```
GET /users/me
```

### 4.2 내 점수 저장

```
POST /users/me/scores
```

**Request:**
```json
{
  "name": "9월 모의고사",
  "examType": "9월모의",
  "suneungScores": { ... },
  "silgiRecords": [ ... ]
}
```

### 4.3 내 점수 목록

```
GET /users/me/scores
```

### 4.4 내 점수 삭제

```
DELETE /users/me/scores/:scoreId
```

---

## 5. 실기 다이어리 API (Phase 4)

### 5.1 실기 기록 추가

```
POST /diary/records
```

**Request:**
```json
{
  "date": "2026-01-11",
  "eventName": "100m",
  "record": 11.5,
  "memo": "컨디션 좋았음"
}
```

### 5.2 실기 기록 조회

```
GET /diary/records
```

**Query Parameters:**
| 파라미터 | 타입 | 설명 |
|----------|------|------|
| eventName | string | 종목 필터 |
| startDate | string | 시작일 |
| endDate | string | 종료일 |

### 5.3 성장 그래프 데이터

```
GET /diary/progress/:eventName
```

---

## 6. 수시 API (Phase 3)

### 6.1 내신 점수 계산

```
POST /calculate/naesin
```

**Request:**
```json
{
  "departmentId": "string",
  "grades": {
    "1-1": { "avg": 2.5, "credits": 30 },
    "1-2": { "avg": 2.3, "credits": 30 },
    "2-1": { "avg": 2.1, "credits": 30 },
    "2-2": { "avg": 2.0, "credits": 30 },
    "3-1": { "avg": 1.8, "credits": 30 }
  }
}
```

### 6.2 수능 최저 충족 여부

```
POST /calculate/minimum-requirement
```

---

## 7. 에러 응답

```json
{
  "error": {
    "code": "INVALID_SCORE",
    "message": "점수가 유효하지 않습니다",
    "details": { ... }
  }
}
```

**에러 코드:**
| 코드 | 설명 |
|------|------|
| UNAUTHORIZED | 인증 필요 |
| FORBIDDEN | 권한 없음 (프리미엄 기능) |
| NOT_FOUND | 리소스 없음 |
| INVALID_SCORE | 유효하지 않은 점수 |
| CALCULATION_ERROR | 계산 오류 |

---

## 8. 인증 헤더

```
Authorization: Bearer {accessToken}
```

---

**작성:** 영철 (Architect)
**상태:** Draft - 검토 필요
