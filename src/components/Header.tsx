import { Menu, X } from "lucide-react";
import Link from "next/link";

export default function Header() {
  return (
    <header className=" flex justify-between px-4 py-6 bg-primary fixed w-full">
      <h2 className="font-bold">Logo</h2>
      <nav className="hidden md:block">
        <ul className="flex gap-2">
          <li>
            <Link href={"/"}>Lien 1</Link>
          </li>
          <li>
            <Link href={"/"}>Lien 2</Link>
          </li>
          <li>
            <Link href={"/"}>Lien 3</Link>
          </li>
          <li>
            <Link href={"/"}>Lien 4</Link>
          </li>
        </ul>
      </nav>
      <Menu size={24} />
      <X size={24} />
    </header>
  );
}
