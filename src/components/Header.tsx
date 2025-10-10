"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { useSession } from "@/lib/auth-client";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import DesktopNav from "./DesktopNav";
import { ThemeToggle } from "./theme-toggle";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";

export default function Header() {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const isMobile = useIsMobile();
  const { data: session } = useSession();

  const handleToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleOpenChange = (open: boolean) => {
    setSidebarOpen(open);
  };

  return isMobile ? (
    <header className="py-6 bg-primary fixed top-0 w-full text-white z-[100]">
      <div
        className={`flex items-center max-w-5xl px-8 mx-auto ${
          session ? "justify-between" : "justify-center"
        }`}
      >
        <h2 className="font-bold text-xl">LOGO</h2>
        {session && (
          <Drawer
            direction="left"
            open={sidebarOpen}
            onOpenChange={handleOpenChange}
          >
            <DrawerTrigger asChild>
              <button onClick={handleToggle} className="focus:outline-none">
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </DrawerTrigger>
            <DrawerContent className="h-auto pt-19">
              <DrawerHeader>
                <DrawerTitle className="text-center text-xl">Logo</DrawerTitle>
              </DrawerHeader>
              <div className="px-4 flex flex-col gap-2 pb-6">
                <Link
                  href="/dashboard"
                  onClick={handleToggle}
                  className="py-2 hover:bg-muted rounded-md px-2"
                >
                  Accueil
                </Link>
                <Link
                  href="/wishlists"
                  onClick={handleToggle}
                  className="py-2 hover:bg-muted rounded-md px-2"
                >
                  Listes
                </Link>
                <Link
                  href="/events"
                  onClick={handleToggle}
                  className="py-2 hover:bg-muted rounded-md px-2"
                >
                  Evènements
                </Link>
                <Link
                  href="/friends"
                  onClick={handleToggle}
                  className="py-2 hover:bg-muted rounded-md px-2"
                >
                  Amis
                </Link>
                <Link
                  href="/profile"
                  onClick={handleToggle}
                  className="py-2 hover:bg-muted rounded-md px-2"
                >
                  Profil
                </Link>
                <ThemeToggle />
              </div>
            </DrawerContent>
          </Drawer>
        )}
      </div>
    </header>
  ) : (
    <header className="py-6 bg-primary fixed top-0 w-full text-white z-[100]">
      <div
        className={`flex items-center max-w-5xl px-8 mx-auto ${
          session ? "justify-between" : "justify-center"
        }`}
      >
        <h2 className="font-bold text-xl">LOGO</h2>
        {session && <DesktopNav />}
      </div>
    </header>
  );
}
