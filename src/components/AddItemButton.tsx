"use client";

import {
  addWishlistItemAction,
  type AddWishlistItemState,
} from "@/actions/addWishlistItem.action";
import { Plus } from "lucide-react";
import React, { useState } from "react";
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

// Composant pour le formulaire
function AddItemForm({
  wishlistId,
  formAction,
  state,
  onCancel,
  isPending,
}: {
  wishlistId: string;
  formAction: (payload: FormData) => Promise<void>;
  state: AddWishlistItemState;
  onCancel: () => void;
  isPending: boolean;
}) {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await formAction(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
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
          disabled={isPending}
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
          disabled={isPending}
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
          disabled={isPending}
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
          disabled={isPending}
          className="flex-1 cursor-pointer"
        >
          Annuler
        </Button>
        <Button
          type="submit"
          disabled={isPending}
          className="flex-1 cursor-pointer"
        >
          {isPending ? (
            <>
              <Spinner className="mr-2" />
              Ajout...
            </>
          ) : (
            "Ajouter"
          )}
        </Button>
      </div>
    </form>
  );
}

interface AddItemButtonProps {
  wishlistId: string;
}

export default function AddItemButton({ wishlistId }: AddItemButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [state, setState] = useState<AddWishlistItemState>({ success: false });

  // Action wrapper qui gère directement l'appel
  const handleFormAction = async (formData: FormData) => {
    setIsPending(true);
    setState({ success: false }); // Reset state

    try {
      const result = await addWishlistItemAction(
        wishlistId,
        { success: false },
        formData
      );
      setState(result);
    } catch (error) {
      setState({
        success: false,
        error:
          error instanceof Error ? error.message : "Une erreur est survenue",
      });
    } finally {
      setIsPending(false);
    }
  };

  // Gestion des effets de la server action
  React.useEffect(() => {
    if (state.success) {
      toast.success("Article ajouté avec succès !");
      setIsOpen(false);
      // Pas de window.location.reload() - la revalidation se charge du cache
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="max-w-sm mx-auto cursor-pointer">
          <Plus />
          Ajouter un article
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[80vh] sm:max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full">
        <DialogHeader>
          <DialogTitle className="text-2xl">Ajouter un article</DialogTitle>
        </DialogHeader>

        <AddItemForm
          wishlistId={wishlistId}
          formAction={handleFormAction}
          state={state}
          onCancel={() => setIsOpen(false)}
          isPending={isPending}
        />
      </DialogContent>
    </Dialog>
  );
}
