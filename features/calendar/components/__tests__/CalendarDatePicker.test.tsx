import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CalendarDatePicker from "../CalendarDatePicker";
import "@testing-library/jest-dom";

describe("CalendarDatePicker", () => {
  const mockOnSelect = jest.fn();
  const user = userEvent.setup();

  beforeEach(() => {
    mockOnSelect.mockClear();
  });

  test("현재 년월을 표시한다", () => {
    render(
      <CalendarDatePicker year={2026} month={4} onSelect={mockOnSelect} />,
    );
    expect(screen.getByText("2026년 4월 ▾")).toBeInTheDocument();
  });

  test("버튼 클릭 시 월 선택 피커가 열린다", async () => {
    render(
      <CalendarDatePicker year={2026} month={4} onSelect={mockOnSelect} />,
    );
    await user.click(screen.getByText("2026년 4월 ▾"));
    expect(screen.getByText("2026년")).toBeInTheDocument();
    expect(screen.getByText("1월")).toBeInTheDocument();
  });

  test("월을 선택하면 onSelect가 호출되고 피커가 닫힌다", async () => {
    render(
      <CalendarDatePicker year={2026} month={4} onSelect={mockOnSelect} />,
    );
    await user.click(screen.getByText("2026년 4월 ▾"));
    await user.click(screen.getByText("7월"));

    expect(mockOnSelect).toHaveBeenCalledWith(2026, 7);
    expect(screen.queryByText("1월")).not.toBeInTheDocument();
  });

  test("년도를 변경한 뒤 월을 선택할 수 있다", async () => {
    render(
      <CalendarDatePicker year={2026} month={4} onSelect={mockOnSelect} />,
    );
    await user.click(screen.getByText("2026년 4월 ▾"));
    await user.click(screen.getByText("›")); // 2027년으로
    await user.click(screen.getByText("3월"));

    expect(mockOnSelect).toHaveBeenCalledWith(2027, 3);
  });

  test("현재 선택된 월이 하이라이트 된다", async () => {
    render(
      <CalendarDatePicker year={2026} month={4} onSelect={mockOnSelect} />,
    );
    await user.click(screen.getByText("2026년 4월 ▾"));

    const aprilButton = screen.getByText("4월");
    expect(aprilButton).toHaveClass("bg-gray-900", "text-white");
  });
});
