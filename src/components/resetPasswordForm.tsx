"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { resetPassword } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface ResetPasswordFormProps {
  token: string;
}

export default function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [isPending, setIsPending] = useState<boolean>(false);
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const password = String(formData.get("password"));
    const confirmPassword = String(formData.get("confirmPassword"));

    if (!password)
      return toast.error("Veuillez renseigner un nouveau mot de passe.");

    if (password !== confirmPassword) {
      return toast.error("Les deux mots de passe sont différents");
    }

    await resetPassword({
      newPassword: password,
      token,
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
          toast.success("Mot de passe mis à jour.");
          router.push("/auth/login");
        },
      },
    });
  }

  return (
    <form className="max-w-sm w-full space-y-4" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-2">
        <Label htmlFor="password">Nouveau mot de passe</Label>
        <Input type="password" id="password" name="password" />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
        <Input type="password" id="confirmPassword" name="confirmPassword" />
      </div>
      <Button type="submit" disabled={isPending}>
        Réinitialiser le mot de passe
      </Button>
    </form>
  );
}
