"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export function ThemeChanger() {
  const { theme, setTheme } = useTheme();

  const handleClick = () => {
    if (theme === "light") {
      setTheme("dark");
    }
    if (theme === "dark") {
      setTheme("light");
    }
  };

  return (
    <div className="flex  items-center">
      <button
        onClick={handleClick}
        className="p-1 rounded-full cursor-pointer "
      >
        {theme === "light" ? <Sun /> : <Moon />}
      </button>
    </div>
  );
}
