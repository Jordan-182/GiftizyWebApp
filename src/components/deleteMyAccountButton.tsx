"use client";

import { deleteUserAction } from "@/actions/deleteUser.action";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

interface DeleteMyAccountButtonProps {
  userId: string;
}

export default function DeleteMyAccountButton({
  userId,
}: DeleteMyAccountButtonProps) {
  const [isPending, setIsPending] = useState<boolean>(false);

  async function handleClick() {
    setIsPending(true);
    const { error } = await deleteUserAction({ userId });
    if (error) {
      toast.error(error);
    } else {
      toast.success("Votre compte a été supprimé");
    }
    setIsPending(false);
  }

  return (
    <Button
      size="sm"
      variant="outline"
      className="rounded-sm cursor-pointer"
      disabled={isPending}
      onClick={handleClick}
    >
      <span>Supprimer mon compte</span>
    </Button>
  );
}
