"use client";

import { deleteUserAction } from "@/actions/deleteUser.action";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";
import { toast } from "sonner";

interface DeleteMyAccountButtonProps {
  userId: string;
}

export default function DeleteMyAccountButton({
  userId,
}: DeleteMyAccountButtonProps) {
  const [isPending, setIsPending] = useState<boolean>(false);
  const [open, setOpen] = useState(false);

  async function handleConfirmDelete() {
    setIsPending(true);
    const { error } = await deleteUserAction({ userId });
    if (error) {
      toast.error(error);
    } else {
      toast.success("Votre compte a été supprimé");
    }
    setIsPending(false);
    setOpen(false);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="rounded-sm cursor-pointer"
          disabled={isPending}
        >
          <span>Supprimer mon compte</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="h-full flex flex-col items-center justify-center gap-6"
      >
        <SheetTitle className="sr-only">
          Confirmer la suppression du compte
        </SheetTitle>
        <div className="flex flex-col items-center justify-center gap-4 w-full">
          <span className="text-lg font-semibold">
            Confirmer la suppression
          </span>
          <span className="text-sm text-muted-foreground text-center">
            Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est
            irréversible.
          </span>
          <div className="flex flex-col gap-2 mt-4">
            <Button
              variant="destructive"
              disabled={isPending}
              onClick={handleConfirmDelete}
              className="cursor-pointer"
            >
              Oui, supprimer mon compte
            </Button>
            <SheetClose asChild>
              <Button
                variant="outline"
                disabled={isPending}
                className="cursor-pointer"
              >
                Annuler
              </Button>
            </SheetClose>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
