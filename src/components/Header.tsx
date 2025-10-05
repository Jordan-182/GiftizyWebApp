"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import DesktopNav from "./DesktopNav";
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

  const handleToggle = () => {
    setSidebarOpen(!sidebarOpen);
    console.log("sidebar open : ", sidebarOpen);
  };

  return isMobile ? (
    <header className="py-6 bg-primary fixed w-full text-white ">
      <div className="flex justify-between items-center max-w-5xl px-8 mx-auto">
        <h2 className="font-bold text-xl">LOGO</h2>
        <Drawer direction="left">
          <DrawerTrigger>
            <div onClick={handleToggle}>
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </div>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle className="text-center">Logo</DrawerTitle>
            </DrawerHeader>
            <div className="px-4 flex flex-col">
              <Link href="/dashboard">Accueil</Link>
              <Link href="/wishlists">Listes</Link>
              <Link href="/events">Evènements</Link>
              <Link href="/friends">Amis</Link>
              <Link href="/profile">Profil</Link>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </header>
  ) : (
    <header className="py-6 bg-primary fixed w-full text-white ">
      <div className="flex justify-between items-center max-w-5xl px-8 mx-auto">
        <h2 className="font-bold text-xl">LOGO</h2>
        <DesktopNav />
      </div>
    </header>
  );
}
