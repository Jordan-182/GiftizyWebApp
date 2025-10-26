"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth-client";
import { useState } from "react";
import { toast } from "sonner";
import { Spinner } from "./ui/spinner";

interface SignInOAuthButtonProps {
  provider: "google" | "facebook";
  signUp?: boolean;
}

export default function SignInOAuthButton({
  provider,
  signUp,
}: SignInOAuthButtonProps) {
  const [isPending, setIsPending] = useState<boolean>(false);

  async function handleClick() {
    await signIn.social({
      provider,
      callbackURL: "/dashboard",
      errorCallbackURL: "/auth/login/error",
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
      },
    });
  }

  const action = signUp ? "Créer un compte" : "Se connecter";
  const providerName = provider === "google" ? "Google" : "Facebook";

  return (
    <Button
      onClick={handleClick}
      disabled={isPending}
      className="cursor-pointer"
    >
      {isPending ? <Spinner /> : `${action} avec ${providerName}`}
    </Button>
  );
}
