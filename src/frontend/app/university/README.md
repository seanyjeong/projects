# 대학 검색 페이지

## 개요

정시 계산 플로우의 두 번째 단계인 대학 검색 화면입니다.

## 기능

### 필터링
- **군별 필터**: 전체 / 가군 / 나군 / 다군
- **지역 필터**: 전체 / 서울 / 경기 / 지방
- **검색**: 대학명 또는 학과명으로 검색

### 대학 선택
- 최대 3개 대학 선택 (가/나/다 각 1개)
- 선택된 대학은 하이라이트 표시
- 선택 개수 실시간 표시

### 화면 이동
- "다음: 실기 기록 입력" 버튼으로 실기 입력 화면으로 이동

## 파일 구조

```
app/university/
├── components/
│   ├── FilterChips.tsx      # 군별/지역별 필터 칩
│   ├── SearchBar.tsx         # 검색 입력
│   ├── UniversityCard.tsx    # 대학/학과 카드
│   └── index.ts              # Export 통합
├── mock-data.ts              # Mock 데이터 (임시)
├── types.ts                  # 타입 정의
├── page.tsx                  # 메인 페이지
└── README.md                 # 이 파일
```

## 컴포넌트 설명

### FilterChips
군별/지역별 필터를 칩 형태로 제공합니다.

**Props:**
- `selectedGroup`: 선택된 군
- `selectedRegion`: 선택된 지역
- `onGroupChange`: 군 변경 핸들러
- `onRegionChange`: 지역 변경 핸들러

### SearchBar
대학명/학과명 검색 입력 필드입니다.

**Props:**
- `value`: 검색어
- `onChange`: 검색어 변경 핸들러
- `placeholder`: 플레이스홀더 텍스트

### UniversityCard
대학/학과 정보를 카드 형태로 표시합니다.

**Props:**
- `university`: 대학 정보 객체
- `isSelected`: 선택 여부
- `onSelect`: 선택 핸들러

## 데이터 구조

### University 타입
```typescript
interface University {
  id: string;
  name: string;
  department: string;
  group: 'ga' | 'na' | 'da';
  region: string;
  quota: number;
  requirements: {
    suneung: {...};
    silgi: {...};
  };
  ratio: {
    suneung: number;
    silgi: number;
  };
}
```

## Mock 데이터

현재는 `mock-data.ts`에서 12개의 임시 대학 데이터를 제공합니다.

**포함된 대학 (예시):**
- 가군: 서울대, 고려대, 이화여대, 아주대
- 나군: 연세대, 건국대, 성균관대, 인하대
- 다군: 한양대, 중앙대, 경희대

## 백엔드 API 연동 준비

`lib/api.ts`에 이미 API 클라이언트가 준비되어 있습니다.

```typescript
import { universityApi } from '@/lib/api';

// 전체 대학 목록 가져오기
const universities = await universityApi.getAll();

// 대학 검색
const results = await universityApi.search({
  keyword: '서울대',
  group: 'ga',
  region: 'seoul',
});
```

### API 연동 시 수정 사항
1. `page.tsx`에서 `MOCK_UNIVERSITIES` 대신 API 호출
2. `useEffect`로 초기 데이터 로딩
3. 로딩 상태 추가 (스켈레톤 로더)
4. 에러 처리 추가

## 상태 관리

현재는 로컬 상태(`useState`)를 사용하지만, 다음 단계에서 Context API나 Zustand로 전환 예정:

```typescript
// 선택된 대학들을 전역 상태로 관리
const { selectedUniversities, setSelectedUniversities } = useUniversityStore();
```

## 스타일링

디자인 시스템(`/plans/DESIGN_SYSTEM.md`)을 따릅니다:
- 8px 그리드 시스템
- CSS 변수 사용 (bg-primary, text-secondary 등)
- Tailwind CSS 유틸리티 클래스
- 터치 타겟 최소 44x44px

## 테스트

개발 서버 실행:
```bash
cd /home/sean/project-s/src/frontend
npm run dev
```

브라우저에서 확인:
```
http://localhost:3000/university
```

## TODO

- [ ] 백엔드 API 연동
- [ ] 로딩 스켈레톤 추가
- [ ] 에러 바운더리 추가
- [ ] 무한 스크롤 또는 페이지네이션
- [ ] 선택된 대학 정보를 Context로 전달
- [ ] 애니메이션 개선 (Framer Motion)
- [ ] 접근성 개선 (ARIA 속성)
- [ ] 반응형 디자인 검증

## 작성자

동현 (Builder) - 2026-01-11
