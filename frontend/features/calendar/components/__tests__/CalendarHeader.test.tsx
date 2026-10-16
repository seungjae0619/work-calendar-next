import { fireEvent, render, screen } from "@testing-library/react";
import CalendarHeader from "../CalendarHeader";
import "@testing-library/jest-dom";

jest.mock("../CalendarDatePicker", () => {
  return function mockCalendarDatePicker() {
    return <div data-testid="mock-date-picker"></div>;
  };
});

describe("CalendarHeader", () => {
  const mockNavigateMonth = jest.fn();
  const mockOnToday = jest.fn();
  const mockOnSelectMonth = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderHeader = () =>
    render(
      <CalendarHeader
        displayYear={2026}
        displayMonth={8}
        navigateMonth={mockNavigateMonth}
        onToday={mockOnToday}
        onSelectMonth={mockOnSelectMonth}
      />,
    );

  it("오늘 버튼이 제대로 렌더링 된다", () => {
    renderHeader();

    expect(
      screen.getByRole("button", {
        name: /오늘/,
      }),
    ).toBeInTheDocument();
  });

  it("이전/다음 버튼 클릭 시 다음 달로 넘어간다", () => {
    renderHeader();

    fireEvent.click(screen.getByText("‹"));
    expect(mockNavigateMonth).toHaveBeenCalledWith("left");

    fireEvent.click(screen.getByText("›"));
    expect(mockNavigateMonth).toHaveBeenCalledWith("right");
  });

  it("오늘 버튼 클릭 시 현재 월로 이동한다", () => {
    renderHeader();

    fireEvent.click(screen.getByText("오늘"));
    expect(mockOnToday).toHaveBeenCalledTimes(1);
  });
});
