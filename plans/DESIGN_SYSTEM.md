# Project S - 디자인 시스템

**작성자:** 민지 (Designer-Minimal)
**작성일:** 2026-01-11
**버전:** 1.0
**철학:** Less, but better.

---

## 목차

1. [컬러 시스템](#1-컬러-시스템)
2. [타이포그래피](#2-타이포그래피)
3. [스페이싱](#3-스페이싱)
4. [컴포넌트](#4-컴포넌트)
5. [아이콘](#5-아이콘)
6. [애니메이션](#6-애니메이션)
7. [Shadcn/ui 설정](#7-shadcnui-설정)

---

## 1. 컬러 시스템

### 1.1 CSS 변수 (globals.css)

```css
:root {
  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  /* 배경 */
  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  --bg-primary: #fafafa;       /* 페이지 배경 */
  --bg-secondary: #ffffff;     /* 카드 배경 */
  --bg-tertiary: #f5f5f5;      /* 입력창 배경 */

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  /* 텍스트 */
  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  --text-primary: #0a0a0a;     /* 제목, 중요 텍스트 */
  --text-secondary: #525252;   /* 본문 */
  --text-tertiary: #a3a3a3;    /* 캡션, placeholder */

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  /* 보더 */
  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  --border: #e5e5e5;           /* 일반 구분선 */
  --border-focus: #0a0a0a;     /* 포커스 상태 */

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  /* 액센트 (차분한 파랑) */
  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  --accent: #2563eb;           /* Primary 버튼, 링크 */
  --accent-hover: #1d4ed8;
  --accent-light: #dbeafe;     /* 배경 강조 */

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  /* 시맨틱 컬러 */
  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  --success: #16a34a;          /* 합격권 */
  --success-light: #dcfce7;
  --warning: #ea580c;          /* 주의 */
  --warning-light: #fed7aa;
  --error: #dc2626;            /* 불합격권 */
  --error-light: #fee2e2;

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  /* 순위 컬러 */
  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  --rank-gold: #fbbf24;        /* 1등 */
  --rank-gold-bg: rgba(251, 191, 36, 0.15);
  --rank-silver: #94a3b8;      /* 2등 */
  --rank-silver-bg: rgba(148, 163, 184, 0.15);
  --rank-bronze: #f97316;      /* 3등 */
  --rank-bronze-bg: rgba(249, 115, 22, 0.15);
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/* 다크 모드 */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
[data-theme="dark"] {
  /* 배경 */
  --bg-primary: #0a0a0a;       /* 순수 검정 아님 */
  --bg-secondary: #171717;
  --bg-tertiary: #262626;

  /* 텍스트 */
  --text-primary: #fafafa;
  --text-secondary: #a3a3a3;
  --text-tertiary: #525252;

  /* 보더 */
  --border: #262626;
  --border-focus: #fafafa;

  /* 액센트 */
  --accent: #3b82f6;           /* 밝은 파랑 */
  --accent-hover: #2563eb;
  --accent-light: #1e3a8a;

  /* 시맨틱 (명도 높임) */
  --success: #22c55e;
  --success-light: #14532d;
  --warning: #f97316;
  --warning-light: #7c2d12;
  --error: #ef4444;
  --error-light: #7f1d1d;

  /* 순위 */
  --rank-gold: #fcd34d;
  --rank-gold-bg: rgba(252, 211, 77, 0.15);
  --rank-silver: #cbd5e1;
  --rank-silver-bg: rgba(203, 213, 225, 0.15);
  --rank-bronze: #fb923c;
  --rank-bronze-bg: rgba(251, 146, 60, 0.15);
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/* 시스템 다크모드 자동 감지 */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    /* 위의 다크 테마 변수 동일 적용 */
    --bg-primary: #0a0a0a;
    --bg-secondary: #171717;
    --bg-tertiary: #262626;
    --text-primary: #fafafa;
    --text-secondary: #a3a3a3;
    --text-tertiary: #525252;
    --border: #262626;
    --border-focus: #fafafa;
    --accent: #3b82f6;
    --accent-hover: #2563eb;
    --accent-light: #1e3a8a;
    --success: #22c55e;
    --warning: #f97316;
    --error: #ef4444;
    --rank-gold: #fcd34d;
    --rank-silver: #cbd5e1;
    --rank-bronze: #fb923c;
  }
}
```

### 1.2 사용 규칙

```
✅ DO:
- 배경: 3가지 (primary > secondary > tertiary)
- 텍스트: 3단계 (primary > secondary > tertiary)
- 액센트: 파랑 하나만
- 시맨틱: 명확한 의미가 있을 때만 (성공/경고/에러)

❌ DON'T:
- 불필요한 색상 추가
- 장식용 그라데이션
- 3가지 이상 브랜드 컬러
```

---

## 2. 타이포그래피

### 2.1 폰트 패밀리

```css
:root {
  --font-sans: 'Pretendard', -apple-system, 'Roboto', sans-serif;
  --font-mono: 'JetBrains Mono', 'SF Mono', 'Menlo', monospace;
}
```

### 2.2 폰트 스케일

```css
:root {
  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  /* Font Size (8px 기준) */
  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  --text-xs: 12px;      /* 캡션, 라벨 */
  --text-sm: 14px;      /* 설명, 버튼 */
  --text-base: 16px;    /* 본문 (기본) */
  --text-lg: 18px;      /* 섹션 제목 */
  --text-xl: 24px;      /* 페이지 제목 */
  --text-2xl: 32px;     /* 큰 숫자 (점수) */
  --text-3xl: 48px;     /* 랜딩 히어로 */

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  /* Font Weight */
  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;      /* 특별한 경우만 */

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  /* Letter Spacing */
  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  --tracking-tight: -0.5px;   /* 제목 */
  --tracking-normal: 0;       /* 본문 */
  --tracking-wide: 0.5px;     /* 캡션 */

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  /* Line Height */
  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  --leading-tight: 1.25;      /* 제목 */
  --leading-normal: 1.6;      /* 본문 */
  --leading-relaxed: 1.75;    /* 긴 글 */
}
```

### 2.3 타이포 클래스

```css
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/* 페이지 제목 */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
.text-page-title {
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  letter-spacing: var(--tracking-tight);
  line-height: var(--leading-tight);
  color: var(--text-primary);
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/* 섹션 제목 */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
.text-section-title {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  letter-spacing: var(--tracking-tight);
  color: var(--text-primary);
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/* 본문 */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
.text-body {
  font-size: var(--text-base);
  font-weight: var(--font-normal);
  line-height: var(--leading-normal);
  color: var(--text-secondary);
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/* 캡션 */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
.text-caption {
  font-size: var(--text-sm);
  font-weight: var(--font-normal);
  color: var(--text-tertiary);
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/* 숫자 (점수, 기록) */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
.text-number {
  font-family: var(--font-mono);
  font-weight: var(--font-medium);
  letter-spacing: var(--tracking-tight);
  color: var(--text-primary);
  font-variant-numeric: tabular-nums; /* 숫자 정렬 */
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/* 랜딩 히어로 */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
.text-hero {
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  line-height: 1.2;
  letter-spacing: var(--tracking-tight);
  color: white;
}
```

---

## 3. 스페이싱

### 3.1 8px 그리드 시스템

```css
:root {
  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  /* Spacing Scale (8px base) */
  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
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
  --space-24: 96px;
}
```

### 3.2 사용 예시

```css
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/* 컴포넌트 내부 패딩 */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
button { padding: var(--space-4) var(--space-6); }  /* 16px 24px */
.card { padding: var(--space-5); }                  /* 20px */
.input { padding: 0 var(--space-4); }               /* 0 16px */

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/* 컴포넌트 간격 */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
.form { gap: var(--space-3); }                      /* 폼 필드 */
.list { gap: var(--space-4); }                      /* 카드 리스트 */
.section { gap: var(--space-6); }                   /* 섹션 */

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/* 페이지 여백 */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
.page { padding: var(--space-5); }                  /* 20px */
.page-bottom { padding-bottom: 100px; }             /* 하단탭+버튼 */
```

### 3.3 여백 비율 원칙

```
내부 패딩 : 요소 간격 = 1 : 1.5

예시:
- 카드 padding: 20px → 카드 간격 gap: 30px (X) 24px (O)
- 버튼 padding: 16px → 버튼 간격 gap: 24px (X) 12px (O)

※ 정확히 1.5배가 아니어도 됨.
   그리드(4/8/12/16/20/24)에서 가까운 값 선택.
```

---

## 4. 컴포넌트

### 4.1 Button

```tsx
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/* Button - Primary */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
<button className="
  h-12                      /* 48px 터치 타겟 */
  px-6                      /* 24px 좌우 패딩 */
  bg-accent hover:bg-accent-hover
  text-white
  text-base font-medium
  rounded-lg               /* 8px */
  transition-all duration-150
  active:scale-[0.98]      /* 터치 피드백 */
  focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2
">
  계산하기
</button>

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/* Button - Secondary */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
<button className="
  h-12 px-6
  bg-bg-tertiary hover:bg-bg-secondary
  text-text-primary
  text-base font-medium
  rounded-lg
  border border-border
  transition-all duration-150
  active:scale-[0.98]
">
  취소
</button>

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/* Button - Ghost */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
<button className="
  h-11 px-4              /* 44px 최소 터치 */
  bg-transparent hover:bg-bg-tertiary
  text-text-secondary
  text-sm font-medium
  rounded-md
  transition-all duration-150
">
  다시 입력
</button>

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/* Button - FAB (Floating) */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
<button className="
  fixed bottom-20 right-5
  w-14 h-14               /* 56px */
  rounded-full
  bg-accent
  text-white
  shadow-lg
  active:scale-95
">
  <PlusIcon className="w-6 h-6" />
</button>
```

### 4.2 Input

```tsx
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/* Input - Text */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
<label className="flex flex-col gap-2">
  <span className="text-sm font-medium text-text-secondary">
    국어 표준점수
  </span>
  <input
    type="text"
    placeholder="130"
    className="
      h-12                      /* 48px */
      px-4
      bg-bg-tertiary
      border border-border
      rounded-lg
      text-base text-text-primary
      placeholder:text-text-tertiary
      transition-all duration-150
      focus:outline-none
      focus:border-border-focus
      focus:bg-bg-secondary
    "
  />
</label>

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/* Input - Number (점수, 기록) */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
<input
  type="text"
  inputMode="numeric"
  pattern="[0-9]*"              /* iOS 숫자 키패드 */
  className="
    h-12 px-4
    text-center                 /* 숫자는 중앙 정렬 */
    font-mono
    bg-bg-tertiary
    border border-border
    rounded-lg
    text-base
    focus:outline-none
    focus:border-border-focus
  "
/>

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/* Input - Error */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
<div className="flex flex-col gap-2">
  <input
    className="
      h-12 px-4
      bg-bg-tertiary
      border-2 border-error      /* 에러 보더 */
      rounded-lg
      animate-shake              /* 흔들림 애니메이션 */
    "
  />
  <span className="flex items-center gap-1 text-sm text-error">
    <AlertCircle className="w-4 h-4" />
    표준점수는 1~200 사이입니다
  </span>
</div>

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/* Input - Select */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
<select className="
  h-12 px-4
  bg-bg-tertiary
  border border-border
  rounded-lg
  text-base
  appearance-none          /* 기본 화살표 제거 */
  bg-[url('/icons/chevron-down.svg')]
  bg-no-repeat
  bg-[right_16px_center]
  focus:outline-none
  focus:border-border-focus
">
  <option>생활과 윤리</option>
  <option>사회문화</option>
</select>
```

### 4.3 Card

```tsx
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/* Card - Basic */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
<div className="
  p-5                      /* 20px */
  bg-bg-secondary
  border border-border
  rounded-xl              /* 12px */
">
  <h3 className="text-lg font-semibold mb-2">제목</h3>
  <p className="text-sm text-text-secondary">설명</p>
</div>

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/* Card - Interactive (클릭 가능) */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
<button className="
  w-full p-5
  bg-bg-secondary hover:bg-bg-tertiary
  border border-border
  rounded-xl
  text-left
  transition-all duration-150
  active:scale-[0.98]
">
  내용
</button>

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/* Card - Result (결과 화면) */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
<div className="
  p-5
  bg-bg-secondary
  border-2 border-border       /* 두꺼운 보더 */
  rounded-xl
">
  <div className="flex items-center gap-2 mb-3">
    <span className="
      px-2 py-1
      bg-rank-gold-bg
      text-rank-gold
      text-sm font-semibold
      rounded-md
    ">
      1등
    </span>
    <h3 className="text-lg font-semibold">서울대 체육교육과</h3>
  </div>

  <div className="font-mono text-3xl font-semibold mb-2">
    965.5<span className="text-base text-text-tertiary"> / 1000</span>
  </div>

  <div className="
    flex flex-col gap-2
    p-4
    bg-bg-tertiary
    rounded-lg
  ">
    <div className="flex justify-between text-sm">
      <span className="text-text-secondary">수능</span>
      <span className="font-mono font-medium">385.5 / 400</span>
    </div>
    <div className="flex justify-between text-sm">
      <span className="text-text-secondary">실기</span>
      <span className="font-mono font-medium">580 / 600</span>
    </div>
  </div>
</div>
```

### 4.4 Modal & BottomSheet

```tsx
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/* Modal Overlay */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
<div className="
  fixed inset-0
  bg-black/50                  /* 50% 투명도 */
  backdrop-blur-sm             /* 4px 블러 */
  z-50
  animate-fade-in
">

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/* BottomSheet */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  <div className="
    fixed bottom-0 left-0 right-0
    max-h-[90vh]
    bg-bg-secondary
    rounded-t-3xl               /* 20px 상단만 */
    p-6
    pb-[calc(24px+env(safe-area-inset-bottom))]
    z-51
    animate-slide-up
    before:absolute
    before:top-3
    before:left-1/2
    before:-translate-x-1/2
    before:w-10
    before:h-1
    before:bg-border
    before:rounded-full          /* 핸들 바 */
  ">
    <h2 className="text-xl font-semibold mb-4">제목</h2>
    <div>내용</div>
  </div>
</div>
```

### 4.5 Tab (하단 네비게이션)

```tsx
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/* Bottom Navigation */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
<nav className="
  fixed bottom-0 left-0 right-0
  h-16                         /* 64px */
  pb-[env(safe-area-inset-bottom)]
  bg-bg-secondary
  border-t border-border
  flex justify-around items-center
  z-40
">
  {/* 탭 아이템 */}
  <button className="
    flex flex-col items-center gap-1
    min-w-16 min-h-12          /* 64px x 48px 터치 영역 */
    text-text-tertiary         /* 비활성 */
    hover:text-text-secondary
    transition-colors duration-150
  ">
    <HomeIcon className="w-6 h-6" />
    <span className="text-xs font-medium">홈</span>
  </button>

  {/* 활성 탭 */}
  <button className="
    flex flex-col items-center gap-1
    min-w-16 min-h-12
    text-accent                /* 활성 */
    transition-colors duration-150
  ">
    <CalculatorIcon className="w-6 h-6" />
    <span className="text-xs font-medium">정시계산</span>
  </button>

  {/* ... 나머지 탭 */}
</nav>
```

### 4.6 Badge

```tsx
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/* Badge - Rank */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
<span className="
  inline-flex items-center gap-1
  px-2 py-1
  bg-rank-gold-bg
  text-rank-gold
  text-sm font-semibold
  rounded-md
">
  🥇 1등
</span>

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/* Badge - Status */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
<span className="
  inline-flex items-center gap-1
  px-2 py-1
  bg-success-light
  text-success
  text-xs font-medium
  rounded-full
">
  합격권
</span>

<span className="
  inline-flex items-center gap-1
  px-2 py-1
  bg-error-light
  text-error
  text-xs font-medium
  rounded-full
">
  불합격권
</span>
```

### 4.7 Toast

```tsx
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/* Toast - Default */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
<div className="
  fixed bottom-20 left-5 right-5
  p-4
  bg-text-primary
  text-bg-primary
  text-sm font-medium
  rounded-lg
  shadow-lg
  z-50
  animate-toast-slide
">
  저장되었습니다
</div>

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/* Toast - Success */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
<div className="
  fixed bottom-20 left-5 right-5
  flex items-center gap-2
  p-4
  bg-success
  text-white
  text-sm font-medium
  rounded-lg
  shadow-lg
  animate-toast-slide
">
  <Check className="w-5 h-5" />
  계산이 완료되었습니다!
</div>
```

---

## 5. 아이콘

### 5.1 아이콘 라이브러리

**Lucide React** 사용 (shadcn/ui 기본)

```bash
npm install lucide-react
```

### 5.2 필요한 아이콘 목록

```tsx
import {
  // 네비게이션
  Home,
  Calculator,
  FileText,
  Calendar,
  User,

  // 액션
  Plus,
  Minus,
  Check,
  X,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Search,
  Filter,
  Share,
  Download,
  Edit,
  Trash2,

  // 상태
  AlertCircle,
  CheckCircle,
  Info,
  AlertTriangle,

  // 기타
  Menu,
  Settings,
  HelpCircle,
  Eye,
  EyeOff,
  Moon,
  Sun,
} from 'lucide-react'
```

### 5.3 아이콘 사용 규칙

```tsx
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/* 크기 */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
<HomeIcon className="w-4 h-4" />     /* 16px - 텍스트 내부 */
<HomeIcon className="w-5 h-5" />     /* 20px - 버튼 내부 */
<HomeIcon className="w-6 h-6" />     /* 24px - 하단탭, 독립 아이콘 */

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/* 스트로크 */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
<HomeIcon
  className="w-6 h-6"
  strokeWidth={2}             /* 기본값: 2 */
/>

<HomeIcon
  className="w-6 h-6"
  strokeWidth={1.5}           /* 얇게: 1.5 (미니멀) */
/>

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/* 색상 */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
<HomeIcon className="w-6 h-6 text-text-secondary" />      /* 일반 */
<HomeIcon className="w-6 h-6 text-accent" />              /* 활성 */
<HomeIcon className="w-6 h-6 text-error" />               /* 에러 */
```

---

## 6. 애니메이션

### 6.1 트랜지션

```css
:root {
  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  /* Duration */
  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  --duration-fast: 150ms;      /* 버튼, 호버 */
  --duration-base: 300ms;      /* 모달, 페이지 전환 */
  --duration-slow: 500ms;      /* 큰 애니메이션 */

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  /* Easing */
  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
}
```

### 6.2 키프레임 애니메이션

```css
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/* Fade In */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.animate-fade-in {
  animation: fade-in 300ms ease-out;
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/* Slide Up (BottomSheet) */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
@keyframes slide-up {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

.animate-slide-up {
  animation: slide-up 300ms ease-out;
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/* Toast Slide */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
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

.animate-toast-slide {
  animation: toast-slide 300ms ease-out;
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/* Shake (Error) */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}

.animate-shake {
  animation: shake 300ms ease;
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/* Spin (Loading) */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 600ms linear infinite;
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/* Page Transition */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
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

.page-enter {
  animation: slide-in-right 300ms ease-out;
}
```

### 6.3 로딩 스피너

```tsx
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/* Spinner */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
<div className="
  w-5 h-5
  border-2 border-accent
  border-t-transparent
  rounded-full
  animate-spin
" />

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/* Loading State (버튼) */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
<button disabled className="
  h-12 px-6
  bg-accent
  text-white
  rounded-lg
  opacity-60              /* 비활성 */
  pointer-events-none
  relative
">
  <span className="opacity-0">계산 중</span>
  <div className="absolute inset-0 flex items-center justify-center">
    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
  </div>
</button>
```

### 6.4 스켈레톤 로더

```tsx
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/* Skeleton */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
<div className="
  h-12
  bg-gradient-to-r from-bg-tertiary via-bg-secondary to-bg-tertiary
  bg-[length:200%_100%]
  animate-shimmer
  rounded-lg
" />
```

```css
@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.animate-shimmer {
  animation: shimmer 1.5s infinite;
}
```

---

## 7. Shadcn/ui 설정

### 7.1 설치

```bash
npx shadcn-ui@latest init
```

### 7.2 components.json

```json
{
  "style": "default",
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/app/globals.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "rsc": true,
  "tsx": true,
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

### 7.3 tailwind.config.ts

```ts
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ["class"],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': 'var(--bg-primary)',
        'bg-secondary': 'var(--bg-secondary)',
        'bg-tertiary': 'var(--bg-tertiary)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-tertiary': 'var(--text-tertiary)',
        'border': 'var(--border)',
        'border-focus': 'var(--border-focus)',
        'accent': 'var(--accent)',
        'accent-hover': 'var(--accent-hover)',
        'accent-light': 'var(--accent-light)',
        'success': 'var(--success)',
        'warning': 'var(--warning)',
        'error': 'var(--error)',
        'rank-gold': 'var(--rank-gold)',
        'rank-silver': 'var(--rank-silver)',
        'rank-bronze': 'var(--rank-bronze)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      spacing: {
        '1': 'var(--space-1)',
        '2': 'var(--space-2)',
        '3': 'var(--space-3)',
        '4': 'var(--space-4)',
        '5': 'var(--space-5)',
        '6': 'var(--space-6)',
        '8': 'var(--space-8)',
        '10': 'var(--space-10)',
        '12': 'var(--space-12)',
        '16': 'var(--space-16)',
      },
      borderRadius: {
        'sm': '6px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        'full': '9999px',
      },
      transitionDuration: {
        'fast': '150ms',
        'base': '300ms',
        'slow': '500ms',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'slide-up': {
          from: { transform: 'translateY(100%)' },
          to: { transform: 'translateY(0)' },
        },
        'toast-slide': {
          from: { transform: 'translateY(100px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        'shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-4px)' },
          '75%': { transform: 'translateX(4px)' },
        },
        'spin': {
          to: { transform: 'rotate(360deg)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
      },
      animation: {
        'fade-in': 'fade-in 300ms ease-out',
        'slide-up': 'slide-up 300ms ease-out',
        'toast-slide': 'toast-slide 300ms ease-out',
        'shake': 'shake 300ms ease',
        'spin': 'spin 600ms linear infinite',
        'shimmer': 'shimmer 1.5s infinite',
      },
    },
  },
  plugins: [],
}

export default config
```

### 7.4 globals.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/* CSS Variables (위의 1. 컬러 시스템 참고) */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
:root {
  /* ... 컬러, 타이포, 스페이싱 변수 */
}

[data-theme="dark"] {
  /* ... 다크모드 변수 */
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/* Base Styles */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
@layer base {
  * {
    @apply border-border;
    transition: background-color 300ms ease,
                color 300ms ease,
                border-color 300ms ease;
  }

  body {
    @apply bg-bg-primary text-text-primary;
    font-family: var(--font-sans);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* 터치 하이라이트 제거 */
  button, a {
    -webkit-tap-highlight-color: transparent;
  }

  /* 부드러운 스크롤 */
  html {
    scroll-behavior: smooth;
  }

  /* iOS 안전 영역 */
  body {
    padding-top: env(safe-area-inset-top);
    padding-bottom: env(safe-area-inset-bottom);
  }
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/* Utilities */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
@layer utilities {
  /* 스크린 리더 전용 */
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

  /* iOS 바운스 방지 */
  .no-bounce {
    overscroll-behavior: none;
  }

  /* 숨김 스크롤바 */
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
}
```

---

## 8. 컴포넌트 설치 목록

```bash
# shadcn/ui 기본 컴포넌트
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add label
npx shadcn-ui@latest add select
npx shadcn-ui@latest add card
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add sheet       # BottomSheet
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add checkbox
npx shadcn-ui@latest add radio-group
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add separator
npx shadcn-ui@latest add skeleton
```

---

## 9. 사용 예시

### 9.1 수능 점수 입력 폼

```tsx
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function ScoreInputForm() {
  return (
    <div className="flex flex-col gap-4 p-5">
      {/* 과목 그룹 */}
      <div className="p-5 bg-bg-secondary border border-border rounded-xl">
        <h3 className="text-lg font-semibold mb-4">국어</h3>

        <div className="flex gap-3">
          {/* 표준점수 */}
          <div className="flex-1">
            <Label htmlFor="korean-std" className="text-sm mb-2">
              표준점수
            </Label>
            <Input
              id="korean-std"
              type="text"
              inputMode="numeric"
              placeholder="130"
              className="text-center font-mono"
            />
          </div>

          {/* 백분위 */}
          <div className="flex-1">
            <Label htmlFor="korean-per" className="text-sm mb-2">
              백분위
            </Label>
            <Input
              id="korean-per"
              type="text"
              inputMode="numeric"
              placeholder="95"
              className="text-center font-mono"
            />
          </div>

          {/* 등급 */}
          <div className="w-20">
            <Label htmlFor="korean-grade" className="text-sm mb-2">
              등급
            </Label>
            <Input
              id="korean-grade"
              type="text"
              inputMode="numeric"
              placeholder="2"
              className="text-center font-mono"
            />
          </div>
        </div>
      </div>

      {/* 저장 버튼 */}
      <Button
        size="lg"
        className="w-full h-12"
      >
        다음
      </Button>
    </div>
  )
}
```

### 9.2 결과 카드

```tsx
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function ResultCard({ rank, university, department, score, maxScore }) {
  const rankColors = {
    1: 'bg-rank-gold-bg text-rank-gold',
    2: 'bg-rank-silver-bg text-rank-silver',
    3: 'bg-rank-bronze-bg text-rank-bronze',
  }

  return (
    <Card className="p-5 border-2">
      {/* 순위 + 대학명 */}
      <div className="flex items-center gap-2 mb-3">
        <Badge className={rankColors[rank] || ''}>
          {rank}등
        </Badge>
        <h3 className="text-lg font-semibold">{university}</h3>
      </div>

      <p className="text-sm text-text-secondary mb-4">{department}</p>

      {/* 총점 */}
      <div className="font-mono text-3xl font-semibold mb-2">
        {score}
        <span className="text-base text-text-tertiary"> / {maxScore}</span>
      </div>

      {/* 세부 점수 */}
      <div className="flex flex-col gap-2 p-4 bg-bg-tertiary rounded-lg">
        <div className="flex justify-between text-sm">
          <span className="text-text-secondary">수능</span>
          <span className="font-mono font-medium">385.5 / 400</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-text-secondary">실기</span>
          <span className="font-mono font-medium">580 / 600</span>
        </div>
      </div>
    </Card>
  )
}
```

---

## 10. 접근성 체크리스트

```
✅ 색상 대비
- [ ] 텍스트: 4.5:1 이상
- [ ] UI 요소: 3:1 이상
- [ ] 다크모드 대비 확인

✅ 키보드 네비게이션
- [ ] Tab으로 모든 요소 접근 가능
- [ ] focus-visible 링 표시
- [ ] 논리적 포커스 순서

✅ 터치 타겟
- [ ] 최소 44x44px
- [ ] 간격 최소 8px
- [ ] 실제 기기 테스트

✅ 스크린 리더
- [ ] aria-label 적용
- [ ] role 속성
- [ ] alt 텍스트

✅ 모션
- [ ] prefers-reduced-motion 고려
- [ ] 애니메이션 필수 아님
```

---

## 11. 마무리

...여백이 디자인입니다.

불필요한 요소는 모두 제거했습니다.

각 컴포넌트는 명확한 목적이 있고,
일관된 간격과 크기 체계를 따릅니다.

shadcn/ui 기반이라 커스터마이징도 쉽습니다.

이제 동현(Builder)에게 넘기겠습니다.

---

**작성:** 민지 (Designer-Minimal)
**다음 단계:** 동현 (Builder) 개발 시작
**문의:** memory-keeper "design" 채널 확인
