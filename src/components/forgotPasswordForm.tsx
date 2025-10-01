"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { forgetPassword } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function ForgotPasswordForm() {
  const [isPending, setIsPending] = useState<boolean>(false);
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const email = String(formData.get("email"));

    if (!email) return toast.error("Veuillez renseigner votre adresse email.");

    await forgetPassword({
      email,
      redirectTo: "/auth/reset-password",
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
          toast.success(
            "Email de réinitialisation envoyé, surveillez votre boîte mail et vos spams"
          );
          router.push("/auth/forgot-password/success");
        },
      },
    });
  }

  return (
    <form className="max-w-sm w-full space-y-4" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input type="email" id="email" name="email" />
      </div>
      <Button type="submit" disabled={isPending}>
        Envoyer un lien de réinitialisation
      </Button>
    </form>
  );
}
