"use client";

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
import { useFriends } from "@/contexts/FriendsContext";
import { deleteFriendship } from "@/lib/api/friends";
import { UserRoundX } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Spinner } from "./ui/spinner";

interface DeleteFriendButtonProps {
  friendshipId: string;
}

export default function DeleteFriendButton({
  friendshipId,
}: DeleteFriendButtonProps) {
  const [isPending, setIsPending] = useState<boolean>(false);
  const { refreshAll } = useFriends();

  async function handleConfirmDelete() {
    setIsPending(true);
    const result = await deleteFriendship(friendshipId);
    if (result) {
      toast.success("Cet ami a été supprimé");
      await refreshAll();
    } else {
      toast.error("Erreur lors de la suppression de l'ami");
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
          <UserRoundX />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Confirmer la suppression de l&apos;ami
          </AlertDialogTitle>
          <AlertDialogDescription>
            Êtes-vous sûr de vouloir supprimer cet ami ? Cette action est
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
            {isPending ? <Spinner /> : "Oui, supprimer cet ami"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
