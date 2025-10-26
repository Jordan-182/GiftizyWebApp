"use client";

import {
  deleteWishlistAction,
  deleteWishlistWithRedirectAction,
  type DeleteWishlistState,
} from "@/actions/deleteWishlist.action";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Spinner } from "./ui/spinner";

interface DeleteListButtonProps {
  wishlistId: string;
  wishlistName: string;
  redirectAfterDelete?: boolean; // Par défaut true, false si on est sur la page liste
}

function DeleteButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      variant="destructive"
      disabled={pending}
      className="w-full cursor-pointer"
    >
      {pending ? <Spinner /> : "Supprimer définitivement"}
    </Button>
  );
}

export default function DeleteListButton({
  wishlistId,
  wishlistName,
  redirectAfterDelete = true,
}: DeleteListButtonProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  // Si pas de redirection, utiliser l'action avec état, sinon l'action directe
  const [state, formAction] = useActionState<DeleteWishlistState, FormData>(
    deleteWishlistAction,
    {
      success: false,
    }
  );

  // Gérer la redirection après suppression réussie (seulement pour les cas sans redirect côté serveur)
  useEffect(() => {
    if (state.success && !redirectAfterDelete) {
      setIsOpen(false);
      router.refresh();
    }
  }, [state.success, router, redirectAfterDelete]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="destructive"
          className="cursor-pointer"
          onClick={() => setIsOpen(true)}
        >
          <Trash2 />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Supprimer la liste</DialogTitle>
          <DialogDescription className="text-left">
            Êtes-vous sûr de vouloir supprimer la liste{" "}
            <span className="font-semibold">{wishlistName}</span> ?
            <br />
            <br />
            Cette action est irréversible et supprimera également tous les
            articles contenus dans cette liste.
          </DialogDescription>
        </DialogHeader>

        {state.error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {state.error}
          </div>
        )}

        <DialogFooter className="flex flex-col gap-2 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(false)}
            className="w-full sm:w-auto cursor-pointer"
          >
            Annuler
          </Button>
          <form
            action={
              redirectAfterDelete
                ? deleteWishlistWithRedirectAction
                : formAction
            }
            className="w-full sm:w-auto"
          >
            <input type="hidden" name="id" value={wishlistId} />
            <DeleteButton />
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
