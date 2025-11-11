"use client";

import { Button } from "@/components//ui/button";
import { useSession } from "@/lib/auth-client";
import Link from "next/link";

export default function GetStartedButton() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <Button size="lg" className="opacity-50">
        C&apos;est parti!
      </Button>
    );
  }

  const href = session ? "/dashboard" : "/auth/login";

  return (
    <div className="flex flex-col items-center gap-4 font-bold">
      <Button size="lg" asChild className="font-bold">
        <Link href={href}>C&apos;est parti!</Link>
      </Button>

      {session && (
        <p className="flex items-center gap-2">
          <span
            data-role={session.user.role}
            className="size-4 rounded-full animate-pulse data-[role=USER]:bg-blue-600 data-[role=ADMIN]:bg-red-600"
          />{" "}
          Bienvenue, {session.user.name}
        </p>
      )}
    </div>
  );
}
