// useEditShift.test.ts
import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEditShift } from "@/hooks/useEditShift";
import { LOGIN_REQUIRED_MESSAGE } from "@/lib/api/shift";
import { supabase } from "@/lib/supabase/client";

// supabase 모듈 전체를 mock
jest.mock("@/lib/supabase/client.ts", () => ({
  supabase: {
    from: jest.fn(),
    auth: {
      getSession: jest.fn(),
    },
  },
}));

// React Query wrapper
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      mutations: { retry: false },
    },
  });
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = "QueryClientWrapper";

  return Wrapper;
};

describe("useEditShift 단위 테스트", () => {
  const mockEq = jest.fn();
  const mockUpdate = jest.fn(() => ({ eq: mockEq }));

  beforeEach(() => {
    jest.clearAllMocks();
    (supabase.from as jest.Mock).mockReturnValue({ update: mockUpdate });
    (supabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: { session: { access_token: "test-token" } },
    });
  });

  it("성공 시 supabase update를 올바른 인자로 호출한다", async () => {
    mockEq.mockResolvedValue({ data: {}, error: null });

    const { result } = renderHook(() => useEditShift(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.mutate({ date: "2026-04-15", changedWorkType: "야간" });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(supabase.from).toHaveBeenCalledWith("shift");
    expect(mockUpdate).toHaveBeenCalledWith({ changed_work_type: "야간" });
    expect(mockEq).toHaveBeenCalledWith("date", "2026-04-15");
  });

  it("supabase 에러 시 mutation이 실패 상태가 된다", async () => {
    mockEq.mockResolvedValue({
      data: null,
      error: { message: "Row not found" },
    });

    const { result } = renderHook(() => useEditShift(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.mutate({ date: "2026-04-15", changedWorkType: "야간" });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toEqual({ message: "Row not found" });
  });

  it("로그인하지 않은 상태면 supabase 호출 없이 실패한다", async () => {
    (supabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: { session: null },
    });

    const { result } = renderHook(() => useEditShift(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.mutate({ date: "2026-04-15", changedWorkType: "야간" });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect((result.current.error as Error).message).toBe(
      LOGIN_REQUIRED_MESSAGE,
    );
    expect(mockUpdate).not.toHaveBeenCalled();
  });
});
