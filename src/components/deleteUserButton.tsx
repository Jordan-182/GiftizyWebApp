"use client";

import { deleteUserAction } from "@/actions/deleteUser.action";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface DeleteUserButtonProps {
  userId: string;
}

export default function DeleteUserButton({ userId }: DeleteUserButtonProps) {
  const [isPending, setIsPending] = useState<boolean>(false);

  async function handleClick() {
    setIsPending(true);
    const { error } = await deleteUserAction({ userId });
    if (error) {
      toast.error(error);
    } else {
      toast.success("Utilisateur supprimé avec succès");
    }
    setIsPending(false);
  }

  return (
    <Button
      size="icon"
      variant="destructive"
      className="size-7 rounded-sm cursor-pointer"
      disabled={isPending}
      onClick={handleClick}
    >
      <span className="sr-only">Supprimer l&apos;utilisateur</span>
      <TrashIcon />
    </Button>
  );
}

export const PlaceholderDeleteUserButton = () => {
  return (
    <Button
      size="icon"
      variant="destructive"
      className="size-7 rounded-sm disabled:cursor-not-allowed"
      disabled
    >
      <span className="sr-only">Supprimer l&apos;utilisateur</span>
      <TrashIcon />
    </Button>
  );
};
