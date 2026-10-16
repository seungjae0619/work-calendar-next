"use client";

import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { ChangeEvent, useState } from "react";
import LoginInput from "@/components/LoginInput";

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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await onLogin(email, password);
      reset();
      onLoginSuccess();
    } catch {
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setEmail("");
    setPassword("");
    setError(false);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSubmit();
  };

  const handleClick = () => {
    reset();
    onOpenChange(false);
  };

  const handleLoginInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.type === "email") {
      setEmail(e.target.value);
    }
    if (e.target.type === "password") {
      setPassword(e.target.value);
    }

    setError(false);
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

        <LoginInput
          email={email}
          error={error}
          password={password}
          isLoading={isLoading}
          onSubmit={onSubmit}
          handleClick={handleClick}
          handleChange={handleLoginInputChange}
        />
      </DialogContent>
    </Dialog>
  );
}
