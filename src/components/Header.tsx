"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { useSession } from "@/lib/auth-client";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
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
  const [mounted, setMounted] = useState<boolean>(false);
  const isMobile = useIsMobile();
  const { data: session } = useSession();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleOpenChange = (open: boolean) => {
    setSidebarOpen(open);
  };

  // Éviter l'hydratation différentielle en rendant d'abord la version desktop
  if (!mounted) {
    return (
      <header className="py-4 bg-primary fixed top-0 w-full text-white z-100 shadow-lg">
        <div
          className={`flex items-center max-w-5xl px-8 mx-auto ${
            session ? "justify-between" : "justify-center"
          }`}
        >
          <div className="flex gap-1 items-center">
            <Image
              src={"/logo.png"}
              alt="Logo Giftizy"
              height={50}
              width={50}
            />
            <h2 className="font-modak text-3xl text-secondary">Giftizy</h2>
          </div>
          {session && <DesktopNav />}
        </div>
      </header>
    );
  }

  return isMobile ? (
    <header className="py-4 bg-foreground fixed top-0 w-full text-secondary z-100 shadow-lg">
      <div
        className={`flex items-center max-w-5xl px-8 mx-auto ${
          session ? "justify-between" : "justify-center"
        }`}
      >
        <div className="flex gap-1 items-center">
          <Image src={"/logo.png"} alt="Logo Giftizy" height={50} width={50} />
          <h2 className="font-modak text-3xl text-secondary">Giftizy</h2>
        </div>

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
            <DrawerContent className="h-auto pt-21">
              <DrawerHeader>
                <DrawerTitle className="text-center text-xl font-extrabold">
                  Giftizy
                </DrawerTitle>
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
                  Compte
                </Link>
                <ThemeToggle />
              </div>
              <Image
                src={"/logo.png"}
                alt="Logo Giftizy"
                height={150}
                width={150}
                className="mx-auto"
              />
            </DrawerContent>
          </Drawer>
        )}
      </div>
    </header>
  ) : (
    <header className="py-4 bg-foreground fixed top-0 w-full text-white z-100 shadow-lg">
      <div
        className={`flex items-center max-w-5xl px-8 mx-auto ${
          session ? "justify-between" : "justify-center"
        }`}
      >
        <div className="flex gap-1 items-center">
          <Image src={"/logo.png"} alt="Logo Giftizy" height={50} width={50} />
          <h2 className="font-modak text-3xl text-secondary">Giftizy</h2>
        </div>
        {session && <DesktopNav />}
      </div>
    </header>
  );
}
