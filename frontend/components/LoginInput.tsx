import { ChangeEvent } from "react";
import { Button } from "./ui/button";

interface Props {
  email: string;
  password: string;
  error: boolean;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  handleClick: () => void;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const inputClassName =
  "h-14 w-full rounded-2xl bg-surface-muted px-4 text-[17px] text-strong placeholder:text-disabled outline-none transition-shadow focus:ring-2 focus:ring-primary disabled:opacity-60";

export default function LoginInput({
  email,
  error,
  password,
  isLoading,
  onSubmit,
  handleClick,
  handleChange,
}: Props) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <input
          type="email"
          autoComplete="email"
          placeholder="이메일을 입력하세요"
          value={email}
          onChange={handleChange}
          disabled={isLoading}
          aria-invalid={error}
          className={inputClassName}
        />
        <input
          type="password"
          autoComplete="current-password"
          placeholder="비밀번호를 입력하세요"
          value={password}
          onChange={handleChange}
          disabled={isLoading}
          aria-invalid={error}
          className={inputClassName}
        />

        {error && (
          <p className="px-1 text-[14px] font-medium text-danger">
            이메일 또는 비밀번호가 틀렸습니다.
          </p>
        )}
      </div>

      <div className="flex gap-2">
        <Button
          type="button"
          variant="weak"
          size="lg"
          className="flex-1"
          onClick={handleClick}
          disabled={isLoading}
        >
          취소
        </Button>
        <Button
          type="submit"
          size="lg"
          className="flex-[2]"
          disabled={isLoading || !email || !password}
        >
          {isLoading ? "로그인 중..." : "로그인"}
        </Button>
      </div>
    </form>
  );
}
