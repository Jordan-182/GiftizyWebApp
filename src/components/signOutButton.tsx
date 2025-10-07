"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Spinner } from "./ui/spinner";

export default function SignOutButton() {
  const [isPending, setIsPending] = useState<boolean>(false);
  const router = useRouter();

  async function handleClick() {
    await signOut({
      fetchOptions: {
        onRequest: () => {
          setIsPending(true);
        },
        onResponse: () => {
          setIsPending(false);
        },
        onError: (context) => {
          toast.error(context.error.message);
        },
        onSuccess: () => {
          toast.success("Vous êtes déconnecté");
          router.push("/auth/login");
        },
      },
    });
  }

  return (
    <Button
      onClick={handleClick}
      size="sm"
      variant="destructive"
      className="cursor-pointer"
      disabled={isPending}
    >
      {isPending ? <Spinner /> : "Déconnexion"}
    </Button>
  );
}
