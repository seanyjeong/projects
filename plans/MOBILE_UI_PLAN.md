# Project S - 모바일 UI 플랜

**작성자:** 민지 (Designer-Minimal) + 디자인팀
**작성일:** 2026-01-11
**버전:** 1.0

---

## 0. 팀 역할 분담

| 디자이너 | 담당 영역 | 특징 |
|---------|----------|------|
| **민지** | 전체 미니멀 시스템, 입력 폼 | 여백, 타이포, 일관성 |
| **다크** | 다크모드, 개발자 도구 | 기능 중심, 정보 밀도 |
| **채린** | 포인트 컬러, 응원 요소 | 감성, 동기부여 |
| **글래스** | 랜딩페이지 | 글래스모피즘, 프리미엄 |

---

## 1. 디자인 원칙 (모바일 퍼스트)

### 핵심 철학
```
Less, but better.
- 여백이 디자인이다
- 타이포그래피가 80%
- 모든 요소는 이유가 있어야 함
- 터치 타겟은 최소 44px
- 입력은 한 화면에 최대 5개 필드
```

### 모바일 우선 규칙
```css
/* 기준 해상도 */
--mobile-min: 320px;   /* iPhone SE */
--mobile-max: 428px;   /* iPhone 14 Pro Max */
--mobile-safe: 360px;  /* 대다수 안드로이드 */

/* 안전 영역 */
--safe-top: env(safe-area-inset-top);
--safe-bottom: env(safe-area-inset-bottom);

/* 터치 타겟 */
--touch-min: 44px;     /* Apple HIG */
--touch-ideal: 48px;   /* Material Design */
--touch-gap: 8px;      /* 버튼 간격 최소 */
```

### 설계 원칙
1. **단순화** - 한 화면에 하나의 목표
2. **명확성** - 다음 액션이 명확해야 함
3. **일관성** - 같은 동작은 같은 패턴
4. **피드백** - 터치 즉시 반응
5. **여백** - 숨 쉴 수 있는 공간

---

## 2. 컬러 시스템

### 2.1 라이트 모드 (민지 + 채린)

```css
/* 기본 */
--bg-primary: #fafafa;      /* 배경 */
--bg-secondary: #ffffff;    /* 카드 */
--bg-tertiary: #f5f5f5;     /* 입력창 */

--text-primary: #0a0a0a;    /* 제목 */
--text-secondary: #525252;  /* 본문 */
--text-tertiary: #a3a3a3;   /* 설명 */

--border: #e5e5e5;          /* 구분선 */
--border-focus: #0a0a0a;    /* 포커스 */

/* 액센트 (채린) */
--accent: #2563eb;          /* 파랑 - 차분하고 신뢰감 */
--accent-light: #dbeafe;    /* 파랑 배경 */

/* 상태 */
--success: #16a34a;         /* 합격권 */
--warning: #ea580c;         /* 주의 */
--error: #dc2626;           /* 불합격권 */

/* 순위 (채린) */
--gold: #fbbf24;            /* 1등 */
--silver: #94a3b8;          /* 2등 */
--bronze: #f97316;          /* 3등 */
```

### 2.2 다크 모드 (다크)

```css
/* 기본 */
--bg-primary: #0a0a0a;
--bg-secondary: #171717;
--bg-tertiary: #262626;

--text-primary: #fafafa;
--text-secondary: #a3a3a3;
--text-tertiary: #525252;

--border: #262626;
--border-focus: #fafafa;

/* 액센트 */
--accent: #3b82f6;          /* 밝은 파랑 */
--accent-light: #1e3a8a;    /* 어두운 배경 */

/* 상태 (대비 높임) */
--success: #22c55e;
--warning: #f97316;
--error: #ef4444;

/* 순위 */
--gold: #fcd34d;
--silver: #cbd5e1;
--bronze: #fb923c;
```

### 2.3 사용 규칙

```
✅ 좋은 예:
- 배경: 흰색 또는 회색
- 텍스트: 검정/회색
- 액센트: 파랑 하나만
- 상태 표시: 초록/빨강 (명확할 때만)

❌ 나쁜 예:
- 배경에 그라데이션
- 3가지 이상 브랜드 컬러
- 불필요한 장식 색상
- 의미 없는 컬러 사용
```

---

## 3. 타이포그래피

### 3.1 폰트 시스템

```css
/* 폰트 패밀리 */
--font-sans: 'Pretendard', -apple-system, 'Roboto', sans-serif;
--font-mono: 'JetBrains Mono', 'SF Mono', monospace;

/* 크기 체계 (8px base) */
--text-xs: 12px;     /* 캡션 */
--text-sm: 14px;     /* 설명 */
--text-base: 16px;   /* 본문 (기본) */
--text-lg: 18px;     /* 중요 본문 */
--text-xl: 24px;     /* 제목 */
--text-2xl: 32px;    /* 큰 제목 */
--text-3xl: 48px;    /* 랜딩 히어로 */

/* 무게 */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;

/* 자간 */
--tracking-tight: -0.5px;   /* 제목 */
--tracking-normal: 0;       /* 본문 */
--tracking-wide: 0.5px;     /* 캡션 */

/* 행간 */
--leading-tight: 1.25;      /* 제목 */
--leading-normal: 1.6;      /* 본문 */
--leading-relaxed: 1.75;    /* 긴 글 */
```

### 3.2 사용 가이드

```css
/* 페이지 제목 */
.page-title {
  font-size: 24px;
  font-weight: 600;
  letter-spacing: -0.5px;
  line-height: 1.25;
  color: var(--text-primary);
}

/* 섹션 제목 */
.section-title {
  font-size: 18px;
  font-weight: 600;
  letter-spacing: -0.5px;
  color: var(--text-primary);
}

/* 본문 */
.body {
  font-size: 16px;
  font-weight: 400;
  line-height: 1.6;
  color: var(--text-secondary);
}

/* 캡션 */
.caption {
  font-size: 14px;
  font-weight: 400;
  color: var(--text-tertiary);
}

/* 숫자 (점수 등) */
.number {
  font-family: var(--font-mono);
  font-weight: 500;
  letter-spacing: -0.5px;
  color: var(--text-primary);
}
```

---

## 4. Spacing 시스템

### 4.1 8px 그리드

```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
--space-20: 80px;
```

### 4.2 사용 규칙

```css
/* 컴포넌트 내부 */
padding: 16px 20px;        /* 버튼 */
padding: 20px;             /* 카드 */
padding: 24px;             /* 섹션 */

/* 컴포넌트 간격 */
gap: 12px;                 /* 폼 필드 */
gap: 16px;                 /* 카드 리스트 */
gap: 24px;                 /* 섹션 */

/* 페이지 여백 */
padding: 20px;             /* 모바일 기본 */
padding: 24px;             /* 중요 페이지 */

/* 여백 비율 */
/* 컴포넌트 내부 : 컴포넌트 간격 = 1 : 1.5 */
/* 예: padding 16px → gap 24px */
```

---

## 5. 컴포넌트 스타일 가이드

### 5.1 버튼

```css
/* Primary 버튼 */
.btn-primary {
  height: 48px;                    /* 터치 타겟 */
  padding: 0 24px;
  background: var(--accent);
  color: white;
  font-size: 16px;
  font-weight: 500;
  border-radius: 8px;
  border: none;
  transition: all 150ms ease;
}

.btn-primary:active {
  transform: scale(0.98);
  background: #1d4ed8;             /* 약간 어둡게 */
}

/* Secondary 버튼 */
.btn-secondary {
  height: 48px;
  padding: 0 24px;
  background: var(--bg-tertiary);
  color: var(--text-primary);
  border: 1px solid var(--border);
  border-radius: 8px;
  transition: all 150ms ease;
}

/* Ghost 버튼 */
.btn-ghost {
  height: 44px;
  padding: 0 16px;
  background: transparent;
  color: var(--text-secondary);
  border: none;
}

/* FAB (Floating Action Button) */
.fab {
  width: 56px;
  height: 56px;
  border-radius: 28px;
  background: var(--accent);
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
```

### 5.2 입력 필드

```css
/* 텍스트 입력 */
.input {
  height: 48px;
  padding: 0 16px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 16px;                 /* iOS 줌 방지 */
  color: var(--text-primary);
  transition: all 150ms ease;
}

.input:focus {
  outline: none;
  border-color: var(--border-focus);
  background: var(--bg-secondary);
}

.input::placeholder {
  color: var(--text-tertiary);
}

/* 라벨 */
.label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
}

/* 에러 상태 */
.input-error {
  border-color: var(--error);
}

.error-message {
  margin-top: 4px;
  font-size: 12px;
  color: var(--error);
}
```

### 5.3 카드

```css
/* 기본 카드 */
.card {
  padding: 20px;
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: 12px;
}

/* 클릭 가능한 카드 */
.card-interactive {
  padding: 20px;
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: 12px;
  transition: all 150ms ease;
}

.card-interactive:active {
  transform: scale(0.98);
  background: var(--bg-tertiary);
}

/* 결과 카드 (순위) */
.result-card {
  padding: 20px;
  background: var(--bg-secondary);
  border: 2px solid var(--border);
  border-radius: 12px;
}

.result-card.rank-1 {
  border-color: var(--gold);
}

.result-card.rank-2 {
  border-color: var(--silver);
}

.result-card.rank-3 {
  border-color: var(--bronze);
}
```

### 5.4 네비게이션 (하단 탭)

```css
/* 하단 네비게이션 바 */
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 64px;
  padding-bottom: env(safe-area-inset-bottom);
  background: var(--bg-secondary);
  border-top: 1px solid var(--border);
  display: flex;
  justify-content: space-around;
  align-items: center;
}

/* 탭 아이템 */
.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  min-width: 64px;                 /* 터치 영역 */
  min-height: 48px;
  color: var(--text-tertiary);
  transition: color 150ms ease;
}

.nav-item.active {
  color: var(--accent);
}

.nav-icon {
  width: 24px;
  height: 24px;
}

.nav-label {
  font-size: 11px;
  font-weight: 500;
}
```

### 5.5 토스트 알림

```css
/* 토스트 (채린) */
.toast {
  position: fixed;
  bottom: calc(64px + 16px);       /* 하단 탭 위 */
  left: 20px;
  right: 20px;
  padding: 16px;
  background: var(--text-primary);
  color: var(--bg-primary);
  border-radius: 8px;
  font-size: 14px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  animation: toast-slide 300ms ease;
}

@keyframes toast-slide {
  from {
    transform: translateY(100px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* 성공 토스트 */
.toast-success {
  background: var(--success);
  color: white;
}
```

---

## 6. 화면별 레이아웃 (320px~428px)

### 6.1 랜딩페이지 (글래스)

```css
/* 히어로 섹션 */
.landing-hero {
  height: 100dvh;                  /* 동적 뷰포트 */
  padding: 60px 20px 120px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
}

/* 글래스모피즘 카드 */
.glass-card {
  padding: 32px 24px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(12px) saturate(150%);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

/* CTA 버튼 */
.landing-cta {
  width: 100%;
  height: 56px;
  background: white;
  color: #667eea;
  font-size: 18px;
  font-weight: 600;
  border-radius: 28px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}
```

### 6.2 수능 점수 입력

```css
/* 페이지 레이아웃 */
.score-input-page {
  padding: 20px;
  padding-bottom: 100px;           /* 하단 탭 + 버튼 공간 */
}

/* 과목 입력 그룹 */
.subject-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: 12px;
}

/* 과목명 */
.subject-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
}

/* 점수 입력 필드들 */
.score-inputs {
  display: flex;
  gap: 8px;
}

.score-inputs .input {
  flex: 1;
  text-align: center;              /* 숫자는 중앙 */
}

/* 고정 하단 버튼 */
.fixed-bottom-button {
  position: fixed;
  bottom: calc(64px + 16px);       /* 하단 탭 + 여백 */
  left: 20px;
  right: 20px;
  z-index: 10;
}
```

### 6.3 대학 검색

```css
/* 검색 헤더 */
.search-header {
  position: sticky;
  top: 0;
  padding: 16px 20px;
  background: var(--bg-primary);
  border-bottom: 1px solid var(--border);
  z-index: 10;
}

/* 필터 칩 */
.filter-chips {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 12px 20px;
  scrollbar-width: none;           /* Firefox */
}

.filter-chips::-webkit-scrollbar {
  display: none;                   /* Chrome */
}

.chip {
  height: 32px;
  padding: 0 12px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border);
  border-radius: 16px;
  font-size: 14px;
  white-space: nowrap;
  transition: all 150ms ease;
}

.chip.active {
  background: var(--accent);
  color: white;
  border-color: var(--accent);
}

/* 대학 리스트 */
.university-list {
  padding: 16px 20px 100px;
}

.university-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: 12px;
  margin-bottom: 12px;
  min-height: 60px;                /* 터치 타겟 */
}

.university-item.selected {
  border-color: var(--accent);
  background: var(--accent-light);
}

/* 체크박스 */
.checkbox {
  width: 24px;
  height: 24px;
  border: 2px solid var(--border);
  border-radius: 6px;
  flex-shrink: 0;
}

.checkbox.checked {
  background: var(--accent);
  border-color: var(--accent);
}
```

### 6.4 실기 기록 입력

```css
/* 성별 선택 */
.gender-select {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

.gender-button {
  flex: 1;
  height: 48px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
}

.gender-button.selected {
  background: var(--accent);
  color: white;
  border-color: var(--accent);
}

/* 종목 입력 */
.event-input {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: 12px;
}

.event-name {
  flex: 1;
  font-size: 15px;
  color: var(--text-primary);
}

.record-input {
  width: 100px;
  height: 40px;
  text-align: right;
  background: var(--bg-tertiary);
  border: 1px solid var(--border);
  border-radius: 6px;
  font-family: var(--font-mono);
  font-size: 16px;
  padding: 0 12px;
}

.unit {
  min-width: 32px;
  font-size: 14px;
  color: var(--text-tertiary);
  text-align: right;
}
```

### 6.5 결과 화면

```css
/* 결과 리스트 */
.result-list {
  padding: 20px;
  padding-bottom: 100px;
}

/* 결과 카드 */
.result-card {
  padding: 20px;
  margin-bottom: 16px;
  background: var(--bg-secondary);
  border: 2px solid var(--border);
  border-radius: 12px;
}

/* 순위 뱃지 (채린) */
.rank-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
}

.rank-badge.rank-1 {
  background: rgba(251, 191, 36, 0.15);
  color: var(--gold);
}

/* 대학명 */
.university-name {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.department-name {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 16px;
}

/* 점수 표시 */
.total-score {
  font-family: var(--font-mono);
  font-size: 32px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 12px;
}

.max-score {
  font-size: 16px;
  color: var(--text-tertiary);
}

/* 세부 점수 */
.score-breakdown {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  background: var(--bg-tertiary);
  border-radius: 8px;
  margin-top: 12px;
}

.score-item {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
}

.score-label {
  color: var(--text-secondary);
}

.score-value {
  font-family: var(--font-mono);
  font-weight: 500;
  color: var(--text-primary);
}

/* 응원 메시지 (채린) */
.encouragement {
  margin-top: 16px;
  padding: 12px;
  background: var(--accent-light);
  border-radius: 8px;
  font-size: 14px;
  color: var(--accent);
  text-align: center;
}
```

---

## 7. 터치 타겟 & 인터랙션

### 7.1 터치 타겟 가이드

```
최소 크기: 44x44px (Apple HIG)
권장 크기: 48x48px (Material Design)
최소 간격: 8px

✅ 좋은 예:
- 버튼: 48px 높이
- 체크박스: 24x24px (주변 패딩 포함 44px)
- 하단 탭: 64px 높이 (아이콘 중심 48px)

❌ 나쁜 예:
- 작은 링크: 28px 높이
- 붙어있는 버튼: 간격 없음
- 너무 작은 체크박스: 16px
```

### 7.2 인터랙션 패턴

```css
/* 탭 피드백 */
.interactive {
  transition: all 150ms ease;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.interactive:active {
  transform: scale(0.98);
  opacity: 0.8;
}

/* 로딩 상태 */
.loading {
  position: relative;
  pointer-events: none;
  opacity: 0.6;
}

.loading::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 20px;
  height: 20px;
  margin: -10px 0 0 -10px;
  border: 2px solid var(--accent);
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 600ms linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* 스와이프 힌트 */
.swipeable::before {
  content: '';
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 40px;
  background: linear-gradient(to left, var(--bg-primary), transparent);
  pointer-events: none;
}
```

### 7.3 스크롤 & 스냅

```css
/* 부드러운 스크롤 */
html {
  scroll-behavior: smooth;
}

/* 수평 스크롤 */
.horizontal-scroll {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
}

.horizontal-scroll > * {
  scroll-snap-align: start;
}

/* iOS 바운스 방지 (필요시) */
.no-bounce {
  overscroll-behavior: none;
}
```

---

## 8. 네비게이션 패턴

### 8.1 하단 탭 구조

```
┌─────────────────────────────────────────┐
│           [< 뒤로] 페이지명              │
├─────────────────────────────────────────┤
│                                         │
│              콘텐츠 영역                │
│                                         │
│            (스크롤 가능)                │
│                                         │
├─────────────────────────────────────────┤
│  🏠    📝    📊    📅    👤             │
│  홈   정시   수시  다이어리 마이         │
└─────────────────────────────────────────┘

하단 탭 높이: 64px + safe-area-inset-bottom
아이콘: 24x24px
라벨: 11px
```

### 8.2 페이지 전환

```css
/* 페이지 전환 애니메이션 */
@keyframes slide-in-right {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slide-out-left {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(-30%);
    opacity: 0;
  }
}

.page-enter {
  animation: slide-in-right 300ms ease;
}

.page-exit {
  animation: slide-out-left 300ms ease;
}
```

### 8.3 모달 & 바텀 시트

```css
/* 모달 오버레이 */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 100;
}

/* 바텀 시트 */
.bottom-sheet {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  max-height: 90vh;
  background: var(--bg-secondary);
  border-radius: 20px 20px 0 0;
  padding: 24px;
  padding-bottom: calc(24px + env(safe-area-inset-bottom));
  z-index: 101;
  animation: slide-up 300ms ease;
}

@keyframes slide-up {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

/* 바텀 시트 핸들 */
.bottom-sheet::before {
  content: '';
  position: absolute;
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 4px;
  background: var(--border);
  border-radius: 2px;
}
```

---

## 9. 입력 폼 UX (수능/실기 특화)

### 9.1 수능 점수 입력 플로우

```
원칙:
1. 한 화면에 한 과목씩 (안내문 명확)
2. 자동 포커스 이동
3. 실시간 유효성 검사
4. 저장 버튼 항상 보임 (고정)

플로우:
[국어] → [수학] → [영어] → [탐구1] → [탐구2] → [한국사]
  ↓        ↓        ↓         ↓         ↓          ↓
표점입력  표점입력  등급선택  과목+표점  과목+표점  등급선택
```

### 9.2 입력 최적화

```css
/* 숫자 키패드 자동 표시 */
.number-input {
  inputmode: numeric;
  pattern: "[0-9]*";
}

/* 자동 포커스 */
.input[data-autofocus] {
  /* JS로 처리: 이전 필드 완료 시 다음 필드 자동 포커스 */
}

/* 입력 완료 표시 (채린) */
.input.completed {
  border-color: var(--success);
  background: rgba(22, 163, 74, 0.05);
}

.input.completed::after {
  content: '✓';
  color: var(--success);
}
```

### 9.3 에러 처리

```css
/* 인라인 에러 */
.input-error {
  border-color: var(--error);
  animation: shake 300ms ease;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}

.error-message {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 4px;
  font-size: 12px;
  color: var(--error);
}

/* 에러 아이콘 */
.error-icon {
  width: 14px;
  height: 14px;
}
```

### 9.4 실기 입력 특화

```
특징:
- 같은 종목은 자동 입력 (대학간 공유)
- 최근 기록 표시 (다이어리 연동)
- 단위 명확히 표시 (초, cm, m, kg)
- 범위 체크 (예: 100m는 9.0~20.0초)

예시:
┌────────────────────────────────────┐
│ 100m                [11.5] 초      │
│ 최근 기록: 11.3초 (5/15)           │
└────────────────────────────────────┘
```

---

## 10. 랜딩페이지 (글래스모피즘)

### 10.1 글래스 스타일 (글래스)

```css
/* 배경 */
.landing-bg {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
}

/* 배경 블러 요소 */
.bg-blur {
  position: absolute;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.6;
}

.bg-blur-1 {
  top: -150px;
  left: -100px;
  background: #f093fb;
}

.bg-blur-2 {
  bottom: -150px;
  right: -100px;
  background: #4facfe;
}

/* 글래스 카드 */
.glass {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(12px) saturate(150%);
  -webkit-backdrop-filter: blur(12px) saturate(150%);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

/* 글래스 버튼 */
.glass-button {
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  font-weight: 600;
}

.glass-button:active {
  background: rgba(255, 255, 255, 0.35);
  transform: scale(0.98);
}
```

### 10.2 히어로 섹션

```html
<div class="landing-hero">
  <div class="glass-card">
    <h1 class="hero-title">
      체대 입시,<br>
      이제 정확하게.
    </h1>
    <p class="hero-subtitle">
      수능 + 실기 점수를 입력하면<br>
      합격 가능성을 실시간으로 계산해요.
    </p>
    <button class="landing-cta">
      무료로 시작하기
    </button>
  </div>
</div>
```

```css
.hero-title {
  font-size: 40px;
  font-weight: 700;
  line-height: 1.2;
  color: white;
  margin-bottom: 16px;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.hero-subtitle {
  font-size: 16px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 32px;
}
```

### 10.3 기능 소개 카드

```css
.feature-grid {
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.feature-card {
  padding: 24px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 16px;
}

.feature-icon {
  width: 48px;
  height: 48px;
  margin-bottom: 16px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.feature-title {
  font-size: 18px;
  font-weight: 600;
  color: white;
  margin-bottom: 8px;
}

.feature-description {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
}
```

---

## 11. 반응형 대응

### 11.1 브레이크포인트

```css
/* 모바일만 지원 (MVP) */
@media (min-width: 320px) {
  /* iPhone SE */
  .container { padding: 16px; }
}

@media (min-width: 375px) {
  /* iPhone 12/13/14 */
  .container { padding: 20px; }
}

@media (min-width: 428px) {
  /* iPhone 14 Pro Max */
  .container { padding: 24px; }
}

/* 태블릿/데스크톱 (Phase 2) */
@media (min-width: 768px) {
  /* 추후 대응 */
}
```

### 11.2 뷰포트 단위

```css
/* 동적 뷰포트 사용 (iOS Safari) */
.full-height {
  height: 100dvh;                  /* Dynamic Viewport Height */
}

/* 안전 영역 */
.with-safe-area {
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
}

/* 하단 탭 + 안전 영역 */
.content-with-nav {
  padding-bottom: calc(64px + env(safe-area-inset-bottom) + 16px);
}
```

---

## 12. 다크모드 전환 (다크)

### 12.1 전환 애니메이션

```css
/* 테마 전환 시 부드러운 애니메이션 */
* {
  transition: background-color 300ms ease,
              color 300ms ease,
              border-color 300ms ease;
}

/* 테마 토글 버튼 */
.theme-toggle {
  width: 48px;
  height: 48px;
  border-radius: 24px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
}

.theme-toggle-icon {
  width: 24px;
  height: 24px;
  color: var(--text-primary);
}
```

### 12.2 다크모드 미디어 쿼리

```css
/* 시스템 설정 따르기 */
@media (prefers-color-scheme: dark) {
  :root {
    --bg-primary: #0a0a0a;
    --text-primary: #fafafa;
    /* ... */
  }
}

/* JS로 수동 전환 */
[data-theme="dark"] {
  --bg-primary: #0a0a0a;
  --text-primary: #fafafa;
  /* ... */
}
```

### 12.3 다크모드 주의사항

```
✅ 다크모드에서 확인:
- 텍스트 대비 (최소 4.5:1)
- 그림자 → 테두리로 대체
- 순위 색상 명도 높임
- 입력창 배경 충분히 밝게

❌ 피해야 할 것:
- 순수 검정 배경 (#000)
- 순수 흰색 텍스트 (#fff)
- 너무 어두운 회색 (대비 부족)
```

---

## 13. 성능 최적화

### 13.1 이미지 최적화

```html
<!-- WebP 사용 -->
<picture>
  <source srcset="image.webp" type="image/webp">
  <img src="image.png" alt="..." loading="lazy">
</picture>

<!-- 아이콘은 SVG -->
<svg width="24" height="24">...</svg>
```

### 13.2 폰트 로딩

```css
/* 폰트 최적화 */
@font-face {
  font-family: 'Pretendard';
  src: url('/fonts/pretendard-subset.woff2') format('woff2');
  font-display: swap;              /* FOUT 방지 */
  unicode-range: U+AC00-D7AF;      /* 한글만 */
}
```

### 13.3 레이아웃 쉬프트 방지

```css
/* 이미지 비율 유지 */
.image-container {
  aspect-ratio: 16 / 9;
  background: var(--bg-tertiary);
}

/* 스켈레톤 로딩 */
.skeleton {
  background: linear-gradient(
    90deg,
    var(--bg-tertiary) 25%,
    var(--bg-secondary) 50%,
    var(--bg-tertiary) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

---

## 14. 접근성 (a11y)

### 14.1 색상 대비

```
WCAG AA 기준:
- 일반 텍스트: 4.5:1
- 큰 텍스트: 3:1
- UI 요소: 3:1

체크 도구:
- Chrome DevTools Lighthouse
- WebAIM Contrast Checker
```

### 14.2 포커스 인디케이터

```css
/* 키보드 포커스 (접근성) */
.interactive:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

/* 터치는 outline 없음 */
.interactive:focus:not(:focus-visible) {
  outline: none;
}
```

### 14.3 스크린 리더

```html
<!-- 의미 있는 레이블 -->
<button aria-label="대학 검색">
  <svg>...</svg>
</button>

<!-- 라이브 영역 -->
<div role="status" aria-live="polite">
  계산 완료!
</div>

<!-- 숨김 텍스트 -->
<span class="sr-only">수능 국어 점수</span>
```

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}
```

---

## 15. 디자인 토큰 (전체)

### 15.1 CSS 변수 전체 정리

```css
:root {
  /* Colors - Light */
  --bg-primary: #fafafa;
  --bg-secondary: #ffffff;
  --bg-tertiary: #f5f5f5;
  --text-primary: #0a0a0a;
  --text-secondary: #525252;
  --text-tertiary: #a3a3a3;
  --border: #e5e5e5;
  --border-focus: #0a0a0a;
  --accent: #2563eb;
  --accent-light: #dbeafe;
  --success: #16a34a;
  --warning: #ea580c;
  --error: #dc2626;
  --gold: #fbbf24;
  --silver: #94a3b8;
  --bronze: #f97316;

  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;

  /* Typography */
  --font-sans: 'Pretendard', -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  --text-xs: 12px;
  --text-sm: 14px;
  --text-base: 16px;
  --text-lg: 18px;
  --text-xl: 24px;
  --text-2xl: 32px;
  --text-3xl: 48px;

  /* Layout */
  --nav-height: 64px;
  --header-height: 56px;
  --touch-min: 44px;
  --touch-ideal: 48px;

  /* Border Radius */
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 9999px;

  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-base: 300ms ease;
  --transition-slow: 500ms ease;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.15);
}

[data-theme="dark"] {
  /* Colors - Dark */
  --bg-primary: #0a0a0a;
  --bg-secondary: #171717;
  --bg-tertiary: #262626;
  --text-primary: #fafafa;
  --text-secondary: #a3a3a3;
  --text-tertiary: #525252;
  --border: #262626;
  --border-focus: #fafafa;
  --accent: #3b82f6;
  --accent-light: #1e3a8a;
  --success: #22c55e;
  --warning: #f97316;
  --error: #ef4444;
  --gold: #fcd34d;
  --silver: #cbd5e1;
  --bronze: #fb923c;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.5);
  --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.7);
}
```

---

## 16. 컴포넌트 체크리스트

### Phase 1 필수 컴포넌트

```
[민지]
- [ ] 버튼 (Primary, Secondary, Ghost)
- [ ] 입력 필드 (Text, Number)
- [ ] 카드 (기본, 인터랙티브, 결과)
- [ ] 체크박스
- [ ] 라디오 버튼
- [ ] 라벨 + 에러 메시지

[다크]
- [ ] 다크모드 토글
- [ ] 테마 전환 애니메이션
- [ ] 다크모드 색상 테스트

[채린]
- [ ] 토스트 알림
- [ ] 순위 뱃지
- [ ] 응원 메시지 카드
- [ ] 성공/에러 상태

[글래스]
- [ ] 글래스 카드
- [ ] 히어로 섹션
- [ ] CTA 버튼
- [ ] 기능 소개 카드

[공통]
- [ ] 하단 네비게이션
- [ ] 페이지 헤더
- [ ] 로딩 스피너
- [ ] 스켈레톤 로더
- [ ] 바텀 시트
- [ ] 모달
```

---

## 17. 디자인 시스템 파일 구조

```
src/
├── styles/
│   ├── globals.css           # CSS 변수 정의
│   ├── tokens/
│   │   ├── colors.css        # 컬러 토큰
│   │   ├── spacing.css       # 간격 토큰
│   │   └── typography.css    # 타이포 토큰
│   └── themes/
│       ├── light.css
│       └── dark.css
│
├── components/
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.module.css
│   │   └── Button.stories.tsx
│   ├── Input/
│   ├── Card/
│   └── ...
│
└── docs/
    └── design-system.md      # 컴포넌트 사용법
```

---

## 18. Figma 가이드 (민지)

### 18.1 Figma 구조

```
Project S - 모바일
├── 📱 Design System
│   ├── Colors
│   ├── Typography
│   ├── Components
│   └── Icons
│
├── 🎨 Screens - Light
│   ├── 01. Landing
│   ├── 02. Login
│   ├── 03. Score Input
│   ├── 04. University Search
│   ├── 05. Record Input
│   └── 06. Results
│
└── 🌙 Screens - Dark
    └── (위와 동일)
```

### 18.2 컴포넌트 네이밍

```
Component/Variant/State

예시:
- Button/Primary/Default
- Button/Primary/Pressed
- Button/Secondary/Disabled
- Input/Default/Empty
- Input/Default/Filled
- Input/Error/Filled
```

---

## 19. 개발 핸드오프 (민지 → 동현)

### 19.1 전달 사항

```markdown
✅ 디자인 완료 후 전달:
1. Figma 링크 (개발자 권한)
2. CSS 변수 전체 (globals.css)
3. 컴포넌트 스펙 (size, spacing, color)
4. 인터랙션 명세 (hover, active, focus)
5. 반응형 브레이크포인트
6. 다크모드 색상 매핑
```

### 19.2 리뷰 요청 (동현 → 민지)

```markdown
✅ 구현 후 리뷰 요청:
1. Vercel 배포 링크 (dev)
2. 실제 기기 테스트 요청
3. 다크모드 전환 확인
4. 터치 타겟 사이즈
5. 입력 플로우 자연스러움
```

---

## 20. QA 체크리스트 (민지 + 은지)

### 20.1 디자인 QA

```
[Layout]
- [ ] 320px에서 깨지지 않음
- [ ] 428px에서 너무 넓지 않음
- [ ] 안전 영역 적용 (notch, home indicator)
- [ ] 하단 탭 위치 정확

[Typography]
- [ ] 최소 폰트 크기 12px 이상
- [ ] 제목/본문 크기 차이 명확
- [ ] 라인 높이 충분 (터치 방해 안됨)

[Colors]
- [ ] 라이트/다크 모드 색상 대비 충분
- [ ] 액센트 컬러 일관성
- [ ] 순위 색상 명확히 구분

[Interaction]
- [ ] 터치 타겟 최소 44px
- [ ] 버튼 누름 피드백 즉시
- [ ] 로딩 상태 명확
- [ ] 에러 메시지 이해 가능

[Accessibility]
- [ ] 색상 대비 4.5:1 이상
- [ ] 포커스 인디케이터 명확
- [ ] 대체 텍스트 (aria-label)
```

### 20.2 실제 기기 테스트

```
필수 테스트 기기:
- iPhone SE (320px)
- iPhone 14 (390px)
- iPhone 14 Pro Max (428px)
- Galaxy S21 (360px)

체크 항목:
- [ ] 노치/펀치홀 대응
- [ ] iOS 바운스 스크롤
- [ ] 안드로이드 하단 제스처바
- [ ] 다크모드 자동 전환
- [ ] 키보드 올라올 때 UI
```

---

## 21. 마일스톤

### Phase 0 (현재)
```
[민지]
- [ ] 디자인 토큰 정의 (colors, spacing, typography)
- [ ] 기본 컴포넌트 Figma 작성 (Button, Input, Card)

[다크]
- [ ] 다크모드 컬러 팔레트 제안
- [ ] 테마 전환 로직 검토

[채린]
- [ ] 액센트 컬러 최종 확정
- [ ] 순위 뱃지 디자인

[글래스]
- [ ] 랜딩페이지 히어로 디자인
- [ ] 글래스 카드 변형
```

### Phase 1
```
[민지]
- [ ] 수능 입력 폼 디자인
- [ ] 대학 검색 UI
- [ ] 실기 입력 UI
- [ ] 결과 화면 디자인

[글래스]
- [ ] 랜딩페이지 전체 완성

[전체]
- [ ] 개발 핸드오프
- [ ] 구현 후 디자인 QA
```

---

## 22. 참고 자료

### 디자인 시스템
- Apple HIG (Human Interface Guidelines)
- Material Design (Mobile)
- Radix UI (Headless Components)
- Shadcn/ui (TailwindCSS)

### 영감
- Linear (모바일 앱)
- Notion (모바일 입력 UX)
- Stripe (결제 플로우)
- Duolingo (응원 메시지)

### 도구
- Figma (디자인)
- Excalidraw (와이어프레임)
- Coolors (컬러 팔레트)
- WebAIM (접근성 체크)

---

## 23. 팀 코멘트

### 민지 (Designer-Minimal)
```
...여백이 디자인입니다.
불필요한 요소는 모두 제거했어요.

수능 입력 폼은... 한 화면에 한 과목씩.
집중할 수 있게.

터치 타겟은 48px로 통일했습니다.
손가락이 큰 사람도 편하게.
```

### 다크 (Designer-Dark)
```
다크모드는 선택이 아니라 필수.
특히 밤에 공부하는 수험생들.

배경은 순수 검정 대신 #0a0a0a.
눈이 덜 피로해요.

개발자 도구 느낌도 좋지만...
이번엔 민지 스타일 따라갔습니다.
```

### 채린 (Designer-Cheering)
```
파란색 하나만 쓰기로 했어요!
차분하고 신뢰감 있게.

순위는 금은동으로 명확히 표시.
1등 볼 때 기분 좋아야죠 😊

"합격권입니다!" 같은 응원 메시지...
작지만 힘이 되길.
```

### 글래스 (Designer-Glass)
```
랜딩페이지는 프리미엄하게.
글래스모피즘으로 고급스러움 연출.

하지만 너무 화려하지 않게.
민지 철학 존중합니다.

첫인상이 중요하니까.
```

---

**최종 검토:** 민지 (Designer-Minimal)
**승인:** 재현 (Director)
**다음 단계:** 동현 (Builder) 개발 시작

---

## memory-keeper 저장

```json
{
  "design-system-defined": "2026-01-11",
  "mobile-first": true,
  "min-touch-target": "44px",
  "color-system": "light-dark-dual",
  "accent-color": "#2563eb",
  "font": "Pretendard",
  "spacing": "8px-grid"
}
```
