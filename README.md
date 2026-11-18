# 지하철 근무표 (work-calendar-next)

지하철 교대 근무자를 위한 근무표 캘린더 앱입니다. 월별 캘린더에서 주간(주)/야간(야)/휴무(휴) 근무 유형을 한눈에 확인하고, 근무 변경 사항과 대체휴무 일수를 기록할 수 있습니다.

## 주요 기능

- **월별 근무 캘린더**: 손가락 드래그(스와이프)로 이전/다음 달을 넘길 수 있고, 넘기는 동안 옆 달의 달력이 함께 보입니다. 헤더에서 월 선택, 오늘로 이동도 할 수 있습니다.
- **근무 유형 표시**: 주/야/휴 근무 유형을 색상 배지로 표시하고, 공휴일(이름 포함)과 주말을 따로 강조합니다.
- **근무 변경 기록**: 로그인 후 날짜를 눌러 근무 유형을 바꿀 수 있고, 변경된 날짜는 빨간 점으로 구분합니다.
- **대체휴무 자동 계산**: 해당 월의 주말·공휴일을 기준으로 대체휴무 일수를 계산해 보여줍니다.
- **로그인**: Supabase 이메일/비밀번호 인증. 로그인한 사용자만 근무를 수정할 수 있습니다.
- **다크 모드**, 모바일 홈 화면 추가(PWA manifest) 지원.

## 기술 스택

- [Next.js](https://nextjs.org) 16 (App Router) + React 19 + TypeScript
- [FullCalendar](https://fullcalendar.io/) — 캘린더 렌더링
- [Framer Motion](https://motion.dev/) — 월 스와이프/드래그 애니메이션
- [Supabase](https://supabase.com/) — 인증 및 데이터 저장
- [TanStack Query](https://tanstack.com/query) — 서버 상태 관리
- [Zustand](https://zustand-demo.pmnd.rs/) — 클라이언트 상태 관리
- Tailwind CSS v4 + Radix UI (토스 스타일 디자인, Pretendard 폰트)
- [@hyunbinseo/holidays-kr](https://github.com/hyunbinseo/holidays-kr) — 한국 공휴일 데이터 (2018–2027)
- [Playwright](https://playwright.dev/) — E2E 테스트

## 프로젝트 구조

앱 코드는 모두 `frontend/` 안에 있습니다.

```
.
├── README.md
└── frontend/
    ├── app/                  # App Router 진입점 (page, layout, manifest, 로그인)
    ├── features/
    │   ├── calendar/         # 월 캘린더: carousel, MonthPanel, 셀/이벤트 렌더링, 헤더
    │   ├── dialog/           # 근무 유형 변경 다이얼로그
    │   └── auth/             # 로그인 다이얼로그
    ├── components/           # 공용 컴포넌트 (테마 전환, 로그인 입력, ui/ 프리미티브)
    ├── hooks/                # useShift / useEditShift (TanStack Query)
    ├── lib/
    │   ├── api/shift.ts      # shift 테이블 조회·수정
    │   └── supabase/         # 브라우저/서버 클라이언트, 인증 서비스
    ├── providers/            # React Query, 테마 Provider
    ├── store/                # Zustand 사용자 스토어
    ├── utils/                # 날짜 범위, 이벤트 변환, 공휴일 래퍼
    ├── types/                # shift 행 타입
    ├── style/                # 전역 CSS 토큰(라이트/다크), FullCalendar 오버라이드
    ├── e2e/                  # Playwright 테스트
    ├── public/               # 아이콘
    └── middleware.ts         # 요청마다 Supabase 세션 쿠키 갱신
```

### 데이터

Supabase의 `shift` 테이블을 사용합니다.

| 컬럼 | 설명 |
|---|---|
| `date` | 날짜 (`YYYY-MM-DD`) |
| `work_type` | 기본 근무 유형 (`주` / `야` / `휴`) |
| `changed_work_type` | 사용자가 변경한 근무 유형 (없으면 `null`) |

캘린더에는 `changed_work_type`이 있으면 그 값을, 없으면 `work_type`을 표시합니다.

## 시작하기

모든 명령은 `frontend/`에서 실행합니다.

### 1. 환경 변수

`frontend/.env.local`을 만들고 Supabase 프로젝트 정보를 넣습니다.

```bash
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key>

# E2E 테스트용 (선택)
E2E_EMAIL=<테스트 계정 이메일>
E2E_PASSWORD=<테스트 계정 비밀번호>
```

### 2. 실행

```bash
cd frontend
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000)에서 확인할 수 있습니다. 개발 서버는 `0.0.0.0`으로 열리므로 같은 네트워크의 휴대폰에서도 `http://<PC IP>:3000`으로 접속할 수 있습니다.

### 기타 스크립트

```bash
npm run build      # 프로덕션 빌드
npm run start      # 빌드 결과 실행
npm run lint       # ESLint 검사
npm run test:e2e   # Playwright E2E 테스트 (개발 서버를 직접 띄움)
```

## 테스트

단위 테스트는 없고 Playwright E2E 테스트만 있습니다.

- 목(mock) 없이 **실제 Supabase 프로젝트**에 연결해 실행하며, 브라우저 시간대는 `Asia/Seoul`로 고정됩니다.
- `e2e/edit-shift.spec.ts`는 이번 달 15일의 실제 `shift` 행을 변경한 뒤 테스트가 끝나면 원래 값으로 되돌립니다.
- `E2E_EMAIL`, `E2E_PASSWORD`가 없으면 건너뜁니다.

```bash
npx playwright install chromium   # 처음 한 번
npm run test:e2e
```

## 참고

- **공휴일 데이터**: `@hyunbinseo/holidays-kr`는 연도별 데이터가 패키지 버전에 포함되어 있어, 새해 공휴일이 발표되면 패키지를 업데이트해야 합니다. 직접 호출하지 말고 `utils/holidays.ts`의 `safeIsHoliday`, `safeGetHolidayNames`를 사용하세요 (데이터 범위 밖 연도는 에러 대신 `false`/`null`).
- **디자인 토큰**: 색상은 `style/globals.css`의 CSS 변수(라이트/다크)로 정의되어 있습니다. 다크 모드를 위해 하드코딩한 색상 대신 토큰(`bg-surface`, `text-strong` 등)을 사용하세요.
