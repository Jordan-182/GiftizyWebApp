"use client";

import { removeInvitationAction } from "@/actions/events.action";
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
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface RemoveInvitationButtonProps {
  eventId: string;
  friendId: string;
  friendName: string;
}

export default function RemoveInvitationButton({
  eventId,
  friendId,
  friendName,
}: RemoveInvitationButtonProps) {
  const [isPending, setIsPending] = useState<boolean>(false);

  async function handleConfirmRemove() {
    setIsPending(true);

    try {
      const formData = new FormData();
      formData.append("eventId", eventId);
      formData.append("friendId", friendId);

      const result = await removeInvitationAction({ success: false }, formData);

      if (result.success) {
        toast.success(result.message || "Invitation supprimée avec succès");
        // Recharger la page pour mettre à jour la liste
        window.location.reload();
      } else {
        toast.error(
          result.error || "Erreur lors de la suppression de l'invitation"
        );
      }
    } catch (error) {
      toast.error("Erreur lors de la suppression de l'invitation");
      console.error(error);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          size="sm"
          disabled={isPending}
          className="h-8 w-8 cursor-pointer"
          title={`Retirer ${friendName}`}
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Retirer l&apos;invité</AlertDialogTitle>
          <AlertDialogDescription>
            Êtes-vous sûr de vouloir retirer {friendName} de cet événement ?
            Cette action est irréversible.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending} className="cursor-pointer">
            Annuler
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirmRemove}
            disabled={isPending}
            className="cursor-pointer bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending ? "Suppression..." : "Oui, retirer"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
