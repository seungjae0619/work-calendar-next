# 지하철 근무표 (work-calendar-next)

지하철 교대 근무자를 위한 근무표 캘린더 앱입니다. 월별 캘린더에서 주간(주)/야간(야)/휴무(휴) 근무 유형을 한눈에 확인하고, 근무 변경 사항과 대체휴무 일수를 기록할 수 있습니다.

## 주요 기능

- **월별 근무 캘린더**: 손가락 드래그(스와이프)로 이전/다음 달을 자연스럽게 넘길 수 있고, 넘어가는 동안 옆 달의 달력이 함께 보입니다.
- **근무 유형 표시**: 주/야/휴 근무 유형을 색상 배지로 표시하고, 공휴일과 주말은 별도로 강조합니다.
- **근무 변경 기록**: 로그인 후 특정 날짜를 눌러 근무 유형을 변경하고, 변경된 날짜는 표시로 구분합니다.
- **대체휴무 자동 계산**: 해당 월의 공휴일·주말 근무를 기준으로 대체휴무 일수를 자동으로 계산해 보여줍니다.
- **로그인**: Supabase 인증을 통해 로그인한 사용자만 근무 내용을 수정할 수 있습니다.
- **다크 모드** 지원.

## 기술 스택

- [Next.js](https://nextjs.org) (App Router) + TypeScript
- [FullCalendar](https://fullcalendar.io/) — 캘린더 렌더링
- [Framer Motion](https://www.framer.com/motion/) — 캘린더 스와이프/드래그 애니메이션
- [Supabase](https://supabase.com/) — 인증 및 데이터 저장
- [TanStack Query](https://tanstack.com/query) — 서버 상태 관리
- [Zustand](https://zustand-demo.pmnd.rs/) — 클라이언트 상태 관리
- Tailwind CSS + Radix UI

## 시작하기

```bash
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000) 에서 확인할 수 있습니다.

### 기타 스크립트

```bash
npm run lint   # ESLint 검사
npm run test   # Jest 테스트 실행
npm run build  # 프로덕션 빌드
```
