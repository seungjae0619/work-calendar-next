import {
  QueryClient,
  QueryClientProvider,
  useQueryClient,
} from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { usePrefetch } from "../usePrefetch";
import useCalendarStore from "@/store/calendar";
import { getMonthRange } from "@/utils/dateHelpers";

jest.mock("@/lib/supabase/client.ts", () => ({
  supabase: {
    from: jest.fn(),
  },
}));

jest.mock("@tanstack/react-query", () => ({
  useQueryClient: jest.fn(),
}));

jest.mock("@/store/calendar", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("@/utils/dateHelpers", () => ({
  getMonthRange: jest.fn(),
}));

jest.mock("@/lib/api/shift", () => ({
  getShift: jest.fn(),
}));

jest.mock("@/lib/api/shift.ts");

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = "QueryClientWrapper";

  return Wrapper;
};

describe("근무표 데이터 prefetching", () => {
  let mockPrefetchQuery: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    mockPrefetchQuery = jest.fn();
    (useQueryClient as jest.Mock).mockReturnValue({
      prefetchQuery: mockPrefetchQuery,
    });

    (useCalendarStore as unknown as jest.Mock).mockImplementation((selector) =>
      selector({ currentDate: "2026-10-15T00:00:00.000Z" }),
    );
  });

  it("현재 달 기준으로 이전, 다음 달 데이터 가져오기", async () => {
    (getMonthRange as jest.Mock)
      .mockReturnValueOnce({ startDate: "2026-09-01", endDate: "2026-09-30" })
      .mockReturnValueOnce({ startDate: "2026-11-01", endDate: "2026-11-30" });

    renderHook(() => usePrefetch());

    expect(mockPrefetchQuery).toHaveBeenCalledTimes(2);

    expect(mockPrefetchQuery).toHaveBeenNthCalledWith(1, {
      queryKey: ["shifts", "2026-09-01", "2026-09-30"],
      queryFn: expect.any(Function),
      staleTime: 1000 * 60 * 5,
    });

    expect(mockPrefetchQuery).toHaveBeenNthCalledWith(2, {
      queryKey: ["shifts", "2026-11-01", "2026-11-30"],
      queryFn: expect.any(Function),
      staleTime: 1000 * 60 * 5,
    });
  });
});
