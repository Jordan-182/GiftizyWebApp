"use client";

import { signUpEmailAction } from "@/actions/signupEmail.action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Spinner } from "./ui/spinner";

export default function RegisterForm() {
  const [isPending, setIsPending] = useState<boolean>(false);
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);
    const formData = new FormData(event.target as HTMLFormElement);
    const { error } = await signUpEmailAction(formData);
    if (error) {
      toast.error(error);
      setIsPending(false);
    } else {
      toast.success(
        "Compte créé avec succès! Surveillez vos emails pour le lien de vérification."
      );
      router.push("/auth/register/success");
    }
    setIsPending(false);
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-sm w-full space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nom</Label>
        <Input type="text" id="name" name="name" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input type="email" id="email" name="email" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Mot de passe</Label>
        <Input type="password" id="password" name="password" />
      </div>
      <Button
        type="submit"
        className="w-full cursor-pointer"
        disabled={isPending}
      >
        {isPending ? <Spinner /> : "Créer mon compte"}
      </Button>
    </form>
  );
}
