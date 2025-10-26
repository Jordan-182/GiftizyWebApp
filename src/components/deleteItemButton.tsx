"use client";

import { deleteWishlistItemAction } from "@/actions/deleteWishlistItem.action";
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
import { useTransition } from "react";
import { toast } from "sonner";
import { Spinner } from "./ui/spinner";

interface DeleteItemButtonProps {
  wishlistId: string;
  itemId: string;
}

export default function DeleteItemButton({
  wishlistId,
  itemId,
}: DeleteItemButtonProps) {
  const [isPending, startTransition] = useTransition();

  async function handleConfirmDelete() {
    startTransition(async () => {
      const result = await deleteWishlistItemAction(wishlistId, itemId);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Cet article a été supprimé");
        // Pas besoin de router.refresh() - la revalidation s'en charge
      }
    });
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          size="icon"
          variant="destructive"
          className="cursor-pointer"
          disabled={isPending}
        >
          <Trash2 />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Confirmer la suppression de l&apos;article
          </AlertDialogTitle>
          <AlertDialogDescription>
            Êtes-vous sûr de vouloir supprimer cet article de votre liste ?
            Cette action est irréversible.
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
            {isPending ? (
              <>
                <Spinner className="mr-2" />
                Suppression...
              </>
            ) : (
              "Oui, supprimer cet article"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
