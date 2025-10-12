"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { deleteProfile } from "@/lib/api/profiles";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface DeleteProfileButtonProps {
  userId: string;
  profileId: string;
}

export default function DeleteProfileButton({
  userId,
  profileId,
}: DeleteProfileButtonProps) {
  const [isPending, setIsPending] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  async function handleConfirmDelete() {
    setIsPending(true);
    const result = await deleteProfile(userId, profileId);
    if (result) {
      toast.success("Le profil a été supprimé");
    } else {
      toast.error("Erreur lors de la suppression du profil");
    }
    setIsPending(false);
    setOpen(false);
    router.refresh();
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
          <span>Supprimer</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="h-full flex flex-col items-center justify-center gap-6"
      >
        <SheetTitle className="sr-only">
          Confirmer la suppression du profil
        </SheetTitle>
        <div className="flex flex-col items-center justify-center gap-4 w-full">
          <span className="text-lg font-semibold">
            Confirmer la suppression
          </span>
          <span className="text-sm text-muted-foreground text-center">
            Êtes-vous sûr de vouloir supprimer ce profil?
          </span>
          <div className="flex flex-col gap-2 mt-4">
            <Button
              variant="destructive"
              disabled={isPending}
              onClick={handleConfirmDelete}
              className="cursor-pointer"
            >
              Oui, supprimer ce profil
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
