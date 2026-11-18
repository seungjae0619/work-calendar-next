const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];
const WEEK_COUNT = 5;

const weekdayColor = (index: number) =>
  index === 0
    ? "text-[var(--sunday)]"
    : index === 6
      ? "text-[var(--saturday)]"
      : "text-weak";

function Bone({ className = "" }: { className?: string }) {
  return <div className={`bg-surface-muted ${className}`} />;
}

export default function Loading() {
  return (
    <div
      role="status"
      aria-label="근무표를 불러오는 중"
      className="w-full max-w-[640px] mx-auto flex flex-col flex-1"
    >
      <span className="sr-only">근무표를 불러오는 중입니다.</span>

      <header className="sticky top-0 z-10 flex items-center justify-between h-14 px-5 bg-background/90 backdrop-blur-md">
        <h1 className="text-[20px] font-bold text-strong">근무표</h1>
        <div className="flex items-center gap-1 motion-safe:animate-pulse">
          <div className="size-9 rounded-full bg-surface-pressed" />
          <div className="h-8 w-[60px] rounded-lg bg-surface-pressed" />
        </div>
      </header>

      <main className="flex-1 px-4 pt-2 pb-10">
        <div className="flex w-full flex-col gap-3">
          <section className="rounded-3xl bg-surface px-2 pt-5 pb-3 shadow-[var(--shadow-card)] sm:px-4">
            <div className="motion-safe:animate-pulse">
              <div className="flex items-center justify-between pl-2 pr-1 pb-4">
                <Bone className="h-9 w-36 rounded-lg" />
                <div className="flex items-center gap-2 pr-1">
                  <Bone className="h-8 w-12 rounded-lg" />
                  <Bone className="size-7 rounded-full" />
                  <Bone className="size-7 rounded-full" />
                </div>
              </div>

              <div className="grid grid-cols-7 pt-2 pb-2.5">
                {WEEKDAYS.map((day, index) => (
                  <span
                    key={day}
                    className={`text-center text-[13px] font-medium ${weekdayColor(index)}`}
                  >
                    {day}
                  </span>
                ))}
              </div>

              {Array.from({ length: WEEK_COUNT }, (_, week) => (
                <div
                  key={week}
                  className={`grid grid-cols-7 ${week > 0 ? "border-t border-line" : ""}`}
                >
                  {WEEKDAYS.map((day) => (
                    <div
                      key={day}
                      className="flex flex-col items-center pt-2 pb-[18px] max-[480px]:pt-1.5 max-[480px]:pb-4"
                    >
                      <div className="flex h-6 items-center">
                        <Bone className="h-3 w-3.5 rounded" />
                      </div>
                      <Bone className="mt-1 size-8 rounded-[10px] sm:size-9 sm:rounded-xl" />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </section>

          <div className="flex items-center justify-center gap-4 pt-1 motion-safe:animate-pulse">
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="flex items-center gap-1.5">
                <div className="size-5 rounded-md bg-surface-pressed" />
                <div className="h-3 w-7 rounded bg-surface-pressed" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
