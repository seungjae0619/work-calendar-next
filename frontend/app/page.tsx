import Calendar from "@/features/calendar/Calendar";
import Login from "./(auth)/login";
import { authServerService } from "@/lib/supabase/auth.server";
import { ThemeChanger } from "@/components/ThemeChanger";

export default async function Home() {
  const { user } = await authServerService.getUser();

  return (
    <div className="w-full max-w-[640px] mx-auto flex flex-col flex-1">
      <header className="sticky top-0 z-10 flex items-center justify-between h-14 px-5 bg-background/90 backdrop-blur-md">
        <h1 className="text-[20px] font-bold text-strong">근무표</h1>
        <div className="flex items-center gap-1">
          <ThemeChanger />
          <Login user={user} />
        </div>
      </header>
      <main className="flex-1 px-4 pt-2 pb-10">
        <Calendar user={user} isLoading={false} />
      </main>
    </div>
  );
}
