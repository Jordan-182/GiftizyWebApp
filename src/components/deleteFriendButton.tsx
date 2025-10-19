"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useFriends } from "@/contexts/FriendsContext";
import { deleteFriendship } from "@/lib/api/friends";
import { UserRoundX } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface DeleteFriendButtonProps {
  friendshipId: string;
}

export default function DeleteFriendButton({
  friendshipId,
}: DeleteFriendButtonProps) {
  const [isPending, setIsPending] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
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
    setOpen(false);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          size="sm"
          variant="destructive"
          className="rounded-sm cursor-pointer"
          disabled={isPending}
        >
          <UserRoundX />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="h-[calc(100dvh-82px)] flex flex-col items-center justify-center gap-6"
      >
        <SheetTitle className="sr-only">
          Confirmer la suppression dde l&apos;ami
        </SheetTitle>
        <div className="flex flex-col items-center justify-center gap-4 w-full">
          <span className="text-lg font-semibold">
            Confirmer la suppression
          </span>
          <span className="text-sm text-muted-foreground text-center">
            Êtes-vous sûr de vouloir supprimer cet ami?
          </span>
          <div className="flex flex-col gap-2 mt-4">
            <Button
              variant="destructive"
              disabled={isPending}
              onClick={handleConfirmDelete}
              className="cursor-pointer"
            >
              Oui, supprimer cet ami
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
