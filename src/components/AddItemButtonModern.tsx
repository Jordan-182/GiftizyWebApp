"use client";

import {
  addWishlistItemAction,
  type AddWishlistItemState,
} from "@/actions/addWishlistItem.action";
import { Plus } from "lucide-react";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Spinner } from "./ui/spinner";

// Composant pour le bouton submit qui utilise useFormStatus correctement
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="flex-1 cursor-pointer">
      {pending ? (
        <>
          <Spinner className="mr-2" />
          Ajout...
        </>
      ) : (
        "Ajouter"
      )}
    </Button>
  );
}

// Composant pour le formulaire qui utilise Server Actions
function AddItemForm({
  wishlistId,
  onSuccess,
}: {
  wishlistId: string;
  onSuccess: () => void;
}) {
  const initialState: AddWishlistItemState = { success: false };

  // useActionState remplace useFormState en React 19
  const [state, formAction] = useActionState(
    (prevState: AddWishlistItemState, formData: FormData) =>
      addWishlistItemAction(wishlistId, prevState, formData),
    initialState
  );

  // Gestion des effets de bord du state
  if (state.success && !state.error) {
    toast.success("Article ajouté avec succès !");
    onSuccess();
    // Pas besoin de window.location.reload() !
  } else if (state.error) {
    toast.error(state.error);
  }

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
          required
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
          required
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
          placeholder="Ex: 299.99"
        />
        {state.fieldErrors?.price && (
          <p className="text-sm text-red-500">{state.fieldErrors.price}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="url">URL (optionnel)</Label>
        <Input
          id="url"
          name="url"
          type="url"
          placeholder="Ex: https://amazon.fr/..."
        />
        {state.fieldErrors?.url && (
          <p className="text-sm text-red-500">{state.fieldErrors.url}</p>
        )}
      </div>

      <div className="flex gap-2 mt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => onSuccess()}
          className="flex-1 cursor-pointer"
        >
          Annuler
        </Button>
        <SubmitButton />
      </div>
    </form>
  );
}

interface AddItemButtonProps {
  wishlistId: string;
}

export default function AddItemButtonModern({
  wishlistId,
}: AddItemButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button className="max-w-sm mx-auto cursor-pointer">
          <Plus />
          Ajouter un article
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-[400px] sm:w-[540px] p-6 overflow-y-auto"
      >
        <SheetHeader className="pb-4">
          <SheetTitle className="text-xl">Ajouter un article</SheetTitle>
        </SheetHeader>

        <AddItemForm
          wishlistId={wishlistId}
          onSuccess={() => setIsOpen(false)}
        />
      </SheetContent>
    </Sheet>
  );
}
