"use client";

import {
  updateWishlistItemAction,
  type UpdateWishlistItemState,
} from "@/actions/updateWishlistItem.action";
import { Pen } from "lucide-react";
import React, { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Spinner } from "./ui/spinner";

// Interface pour l'item à modifier
interface WishlistItem {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  wishlistId: string;
}

// Composant pour le formulaire qui utilise useFormStatus
function UpdateItemForm({
  item,
  formAction,
  state,
  onCancel,
}: {
  item: WishlistItem;
  formAction: (payload: FormData) => void;
  state: UpdateWishlistItemState;
  onCancel: () => void;
}) {
  const { pending } = useFormStatus();

  return (
    <form
      action={formAction}
      className="flex flex-col gap-4 mt-4 w-full max-w-md"
    >
      <div className="space-y-2">
        <Label htmlFor="name">
          Nom de l&apos;article <span className="text-red-500">*</span>
        </Label>
        <Input
          id="name"
          name="name"
          type="text"
          defaultValue={item.name}
          required
          disabled={pending}
          placeholder="Ex: Nintendo Switch"
        />
        {state.fieldErrors?.name && (
          <p className="text-sm text-red-500">{state.fieldErrors.name}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">
          Description <span className="text-red-500">*</span>
        </Label>
        <Input
          id="description"
          name="description"
          type="text"
          defaultValue={item.description || ""}
          required
          disabled={pending}
          placeholder="Ex: Console de jeu portable"
        />
        {state.fieldErrors?.description && (
          <p className="text-sm text-red-500">
            {state.fieldErrors.description}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">Prix (optionnel)</Label>
        <Input
          id="price"
          name="price"
          type="number"
          min="0"
          step="0.01"
          defaultValue={item.price || ""}
          disabled={pending}
          placeholder="Ex: 299.99"
        />
        {state.fieldErrors?.price && (
          <p className="text-sm text-red-500">{state.fieldErrors.price}</p>
        )}
      </div>

      <div className="flex gap-2 mt-6">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={pending}
          className="flex-1 cursor-pointer"
        >
          Annuler
        </Button>
        <Button
          type="submit"
          disabled={pending}
          className="flex-1 cursor-pointer"
        >
          {pending ? (
            <>
              <Spinner className="mr-2" />
              Modification...
            </>
          ) : (
            "Modifier"
          )}
        </Button>
      </div>
    </form>
  );
}

interface UpdateItemButtonProps {
  item: WishlistItem;
}

export default function UpdateItemButton({ item }: UpdateItemButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const initialState: UpdateWishlistItemState = { success: false };

  const [state, formAction] = useActionState(
    (prevState: UpdateWishlistItemState, formData: FormData) =>
      updateWishlistItemAction(item.wishlistId, item.id, prevState, formData),
    initialState
  );

  // Gestion des effets de la server action
  React.useEffect(() => {
    if (state.success) {
      toast.success("Article modifié avec succès !");
      setIsOpen(false);
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer" size={"icon"}>
          <Pen />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[80vh] sm:max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Modifier l&apos;article
          </DialogTitle>
        </DialogHeader>

        <UpdateItemForm
          item={item}
          formAction={formAction}
          state={state}
          onCancel={() => setIsOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
