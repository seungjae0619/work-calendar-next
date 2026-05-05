import { fireEvent, render, screen } from "@testing-library/react";
import CalendarHeader from "../CalendarHeader";
import FullCalendar from "@fullcalendar/react";
import "@testing-library/jest-dom";

jest.mock("../../hooks/useCalendarLogic", () => ({
  useDialogEvent: jest.fn(() => ({
    handleDatePickerSelect: jest.fn(),
  })),
}));

jest.mock("../CalendarDatePicker", () => {
  return function mockCalendarDatePicker() {
    return <div data-testid="mock-date-picker"></div>;
  };
});

describe("CalendarHeader", () => {
  const mockNavigateMonth = jest.fn();
  const mockToday = jest.fn();

  const fullCalendarRef = {
    current: {
      getApi: () => ({
        today: mockToday,
      }),
    } as unknown as FullCalendar,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("오늘 버튼이 제대로 렌더링 된다", () => {
    render(
      <CalendarHeader
        calendarRef={fullCalendarRef}
        navigateMonth={mockNavigateMonth}
      />,
    );

    screen.debug();

    expect(
      screen.getByRole("button", {
        name: /오늘/,
      }),
    ).toBeInTheDocument();
  });

  it("이전/다음 버튼 클릭 시 다음 달로 넘어간다", () => {
    render(
      <CalendarHeader
        calendarRef={fullCalendarRef}
        navigateMonth={mockNavigateMonth}
      />,
    );

    fireEvent.click(screen.getByText("‹"));
    expect(mockNavigateMonth).toHaveBeenCalledWith("right");

    fireEvent.click(screen.getByText("›"));
    expect(mockNavigateMonth).toHaveBeenCalledWith("left");
  });

  it("오늘 버튼 클릭 시 현재 월로 이동한다", () => {
    render(
      <CalendarHeader
        calendarRef={fullCalendarRef}
        navigateMonth={mockNavigateMonth}
      />,
    );

    fireEvent.click(screen.getByText("오늘"));
    expect(mockToday).toHaveBeenCalledTimes(1);
  });
});
