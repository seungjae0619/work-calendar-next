"use client";

import LoginDialog from "@/features/auth/LoginDialog";
import { Button } from "@/components/ui/button";
import { authClientService } from "@/lib/supabase/auth.client";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login({ user }: { user: User | null }) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleLoginSuccess = () => {
    setIsOpen(false);
    router.refresh();
  };

  const onLogin = async (email: string, password: string) => {
    await authClientService.login(email, password);
  };

  const onLogout = async () => {
    try {
      await authClientService.logout();
      router.refresh();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Button
        onClick={() => (user ? onLogout() : setIsOpen(true))}
        className="bg-gray-700 text-white hover:bg-gray-600"
      >
        {user ? "로그아웃" : "로그인"}
      </Button>
      <LoginDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        onLoginSuccess={handleLoginSuccess}
        onLogin={onLogin}
      />
    </div>
  );
}
