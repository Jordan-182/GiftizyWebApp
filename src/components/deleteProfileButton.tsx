"use client";

import { deleteProfileAction } from "@/actions/profiles.actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface DeleteProfileButtonProps {
  profileId: string;
}

export default function DeleteProfileButton({
  profileId,
}: DeleteProfileButtonProps) {
  const [isPending, setIsPending] = useState<boolean>(false);
  const router = useRouter();

  async function handleConfirmDelete() {
    setIsPending(true);
    const result = await deleteProfileAction(profileId);
    if (result.success) {
      toast.success("Le profil a été supprimé");
      router.refresh();
    } else {
      toast.error(result.error || "Erreur lors de la suppression du profil");
    }
    setIsPending(false);
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          size="sm"
          variant="destructive"
          className="rounded-sm cursor-pointer"
          disabled={isPending}
        >
          <span>Supprimer</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
          <AlertDialogDescription>
            Êtes-vous sûr de vouloir supprimer ce profil ? Cette action est
            irréversible.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending} className="cursor-pointer">
            Annuler
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirmDelete}
            disabled={isPending}
            className="cursor-pointer bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending ? "Suppression..." : "Oui, supprimer"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
