import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useShift } from "../useShift";
import { renderHook, waitFor } from "@testing-library/react";
import { getShift } from "@/lib/api/shift";
import { get } from "http";

jest.mock("@/lib/supabase/client.ts", () => ({
  supabase: {
    from: jest.fn(),
  },
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

const mockShiftDetails = [
  {
    date: "2026-04-02",
    work_type: "주",
    changed_work_type: null,
  },
];

describe("GET shift data", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("입력한 날짜에 맞는 데이터를 가져오는지 확인", async () => {
    (getShift as jest.Mock).mockResolvedValue({ shift: mockShiftDetails });
    const startDate = "2026-04-01";
    const endDate = "2026-04-01";
    const { result } = renderHook(() => useShift(startDate, endDate), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.shift).toEqual(mockShiftDetails);
    });

    expect(getShift).toHaveBeenCalledWith(startDate, endDate);
  });
});
