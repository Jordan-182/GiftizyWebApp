"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { deleteWishlistItem } from "@/lib/api/wishlistItems";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface DeleteItemButtonProps {
  wishlistId: string;
  itemId: string;
}

export default function DeleteItemButton({
  wishlistId,
  itemId,
}: DeleteItemButtonProps) {
  const [isPending, setIsPending] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  async function handleConfirmDelete() {
    setIsPending(true);
    const { error } = await deleteWishlistItem(wishlistId, itemId);
    if (error) {
      toast.error(error);
    } else {
      toast.success("Cet article a été supprimé");
      router.refresh();
    }
    setIsPending(false);
    setOpen(false);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          size="icon"
          variant="destructive"
          className="cursor-pointer"
          disabled={isPending}
        >
          <Trash2 />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="h-[calc(100dvh-82px)] flex flex-col items-center justify-center gap-6"
      >
        <SheetTitle className="sr-only">
          Confirmer la suppression de l&apos;article
        </SheetTitle>
        <div className="flex flex-col items-center justify-center gap-4 w-full">
          <span className="text-lg font-semibold">
            Confirmer la suppression
          </span>
          <span className="text-sm text-muted-foreground text-center">
            Êtes-vous sûr de vouloir supprimer cet article de votre liste?
          </span>
          <div className="flex flex-col gap-2 mt-4">
            <Button
              variant="destructive"
              disabled={isPending}
              onClick={handleConfirmDelete}
              className="cursor-pointer"
            >
              Oui, supprimer cet article
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
