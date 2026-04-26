"use client";

import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { useLoginForm } from "@/hooks/useLoginForm";

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLoginSuccess: () => void;
  onLogin: (email: string, password: string) => Promise<void>;
}

export default function LoginDialog({
  open,
  onOpenChange,
  onLoginSuccess,
  onLogin,
}: LoginDialogProps) {
  const {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    error,
    setError,
    handleSubmit,
    reset,
  } = useLoginForm(onLogin, onLoginSuccess, () => onOpenChange(false));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSubmit();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-500 border-gray-500 w-80">
        <DialogHeader>
          <DialogTitle>
            <span className="text-white">관리자 로그인</span>
          </DialogTitle>
          <DialogDescription className="sr-only">
            로그인 다이얼로그
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit}>
          <div className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="이메일을 입력하세요"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(false);
              }}
              disabled={isLoading}
              className="px-3 py-2 bg-gray-600 text-white border border-gray-400 rounded placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              disabled={isLoading}
              className="px-3 py-2 bg-gray-600 text-white border border-gray-400 rounded placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            {error ? (
              <p className="text-red-400 font-bold">
                이메일 또는 비밀번호가 틀렸습니다.
              </p>
            ) : (
              ""
            )}

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                onClick={() => {
                  reset();
                  onOpenChange(false);
                }}
                disabled={isLoading}
                className="bg-gray-700 text-white hover:bg-gray-600"
              >
                취소
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 text-white hover:bg-blue-500"
              >
                {isLoading ? "로그인 중..." : "로그인"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
