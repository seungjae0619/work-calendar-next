import Calendar from "@/features/calendar/Calendar";
import Login from "./(auth)/login";
import { authServerService } from "@/lib/supabase/auth.server";

export default async function Home() {
  const { user } = await authServerService.getUser();

  return (
    <div className="flex flex-col w-screen h-screen md:h-auto">
      <div className="md:w-200 mb-1 flex md:mx-auto px-3 md:px-0 py-3">
        <header className="w-full flex justify-between items-center">
          <h2 className="text-lg font-bold md:text-2xl ">근무표</h2>
          <Login user={user} />
        </header>
      </div>
      <main className="flex-1 p-2 md:flex-none">
        <Calendar isLoggedIn={user} isLoading={false} />
      </main>
    </div>
  );
}
