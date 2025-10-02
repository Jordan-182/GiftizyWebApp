"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import * as React from "react";

import { Button } from "@/components/ui/button";

export function ThemeToggleDropdown() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const themes = [
    { name: "light", label: "Clair", icon: Sun },
    { name: "dark", label: "Sombre", icon: Moon },
    { name: "system", label: "Système", icon: Monitor },
  ];

  return (
    <div className="flex items-center gap-2">
      {themes.map(({ name, label, icon: Icon }) => (
        <Button
          key={name}
          variant={theme === name ? "default" : "outline"}
          size="sm"
          onClick={() => setTheme(name)}
          className="flex items-center gap-2"
        >
          <Icon className="h-4 w-4" />
          {label}
        </Button>
      ))}
    </div>
  );
}
