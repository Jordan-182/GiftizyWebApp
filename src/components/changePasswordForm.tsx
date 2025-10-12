"use client";

import { changePasswordAction } from "@/actions/changePassword.action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import { Spinner } from "./ui/spinner";

export default function ChangePasswordForm() {
  const [isPending, setIsPending] = useState<boolean>(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);

    setIsPending(true);

    const { error } = await changePasswordAction(formData);

    if (error) {
      toast.error(error);
    } else {
      toast.success("Mot de passe modifié.");
      (event.target as HTMLFormElement).reset();
    }
    setIsPending(false);
  }

  return (
    <form
      className="flex flex-col gap-2 w-full space-y-4"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="currentPassword">Mot de passe actuel</Label>
        <Input type="password" id="currentPassword" name="currentPassword" />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="newPassword">Nouveau mot de passe</Label>
        <Input type="password" id="newPassword" name="newPassword" />
      </div>
      <Button type="submit" disabled={isPending} className="cursor-pointer">
        {!isPending ? <p>Mettre à jour</p> : <Spinner />}
      </Button>
    </form>
  );
}
