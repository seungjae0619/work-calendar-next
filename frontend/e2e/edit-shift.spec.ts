import { test, expect } from "@playwright/test";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const EMAIL = process.env.E2E_EMAIL;
const PASSWORD = process.env.E2E_PASSWORD;
const WORK_TYPES = ["주", "야", "휴"] as const;
const WORK_TYPE_LABELS: Record<string, string> = {
  주: "주간",
  야: "야간",
  휴: "휴무",
};

const yearMonth = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Seoul",
  year: "numeric",
  month: "2-digit",
}).format(new Date());
const TARGET_DATE = `${yearMonth}-15`;

type ShiftRow = {
  date: string;
  work_type: string;
  changed_work_type: string | null;
};

test.describe("근무 변경", () => {
  test.skip(
    !EMAIL || !PASSWORD,
    "E2E_EMAIL / E2E_PASSWORD 환경 변수가 없어 건너뜁니다.",
  );

  let supabase: SupabaseClient;
  let original: ShiftRow;

  const fetchRow = async () => {
    const { data, error } = await supabase
      .from("shift")
      .select("date, work_type, changed_work_type")
      .eq("date", TARGET_DATE)
      .single<ShiftRow>();
    if (error) throw error;
    return data;
  };

  test.beforeAll(async () => {
    supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { persistSession: false } },
    );
    const { error } = await supabase.auth.signInWithPassword({
      email: EMAIL!,
      password: PASSWORD!,
    });
    if (error) throw error;

    original = await fetchRow();
  });

  test.afterAll(async () => {
    if (!supabase) return;
    if (original) {
      const { error } = await supabase
        .from("shift")
        .update({ changed_work_type: original.changed_work_type })
        .eq("date", TARGET_DATE);
      if (error) throw error;
    }
    await supabase.auth.signOut();
  });

  test("로그인 후 날짜를 눌러 근무 유형을 변경하면 달력과 DB에 반영된다", async ({
    page,
  }) => {
    const currentType = original.changed_work_type || original.work_type;
    const nextType = WORK_TYPES.find((type) => type !== currentType)!;

    await page.goto("/");

    await page.getByRole("button", { name: "로그인", exact: true }).click();
    const loginDialog = page.getByRole("dialog");
    await loginDialog.getByPlaceholder("이메일을 입력하세요").fill(EMAIL!);
    await loginDialog.getByPlaceholder("비밀번호를 입력하세요").fill(PASSWORD!);
    await loginDialog
      .getByRole("button", { name: "로그인", exact: true })
      .click();
    await expect(page.getByRole("button", { name: "로그아웃" })).toBeVisible();

    const dayCell = page.locator(`td[data-date="${TARGET_DATE}"]`).filter({
      has: page.locator(".fc-event"),
    });
    const event = dayCell.locator(".fc-event");
    await expect(event).toHaveText(currentType);

    await event.click();
    const shiftDialog = page.getByRole("dialog");
    await expect(shiftDialog).toContainText(TARGET_DATE);
    await expect(shiftDialog).toContainText(
      `본근무${WORK_TYPE_LABELS[original.work_type]}`,
    );

    await shiftDialog.getByRole("radio", { name: nextType, exact: true }).click();
    await shiftDialog.getByRole("button", { name: "변경" }).click();
    await expect(shiftDialog).toBeHidden();

    await expect(event).toHaveText(nextType);
    const changedDot = dayCell.locator(".bg-red-500");
    if (nextType !== original.work_type) {
      await expect(changedDot).toBeVisible();
    } else {
      await expect(changedDot).toHaveCount(0);
    }

    expect((await fetchRow()).changed_work_type).toBe(nextType);

    await page.reload();
    await expect(event).toHaveText(nextType);
  });
});
