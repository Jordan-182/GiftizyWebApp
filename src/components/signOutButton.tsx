"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function SignOutButton() {
  const router = useRouter();

  async function handleClick() {
    await signOut({
      fetchOptions: {
        onError: (context) => {
          toast.error(context.error.message);
        },
        onSuccess: () => {
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
    >
      Déconnexion
    </Button>
  );
}
