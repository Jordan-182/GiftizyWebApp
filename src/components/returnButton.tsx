import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";

interface ReturnButtonProps {
  href: string;
  label: string;
}

export default function ReturnButton({ href, label }: ReturnButtonProps) {
  return (
    <Button size="sm">
      <ArrowLeftIcon />
      <Link href={href}> {label}</Link>
    </Button>
  );
}
