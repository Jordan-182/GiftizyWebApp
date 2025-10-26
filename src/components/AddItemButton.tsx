"use client";

import { addWishlistItem } from "@/lib/api/wishlistItems";
import type { CreateWishlistItemInput } from "@/schemas";
import { Plus } from "lucide-react";
import { useState } from "react";
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

// Composant pour le formulaire qui utilise useFormStatus
function AddItemForm({
  wishlistId,
  onSuccess,
}: {
  wishlistId: string;
  onSuccess: () => void;
}) {
  const { pending } = useFormStatus();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Stocker la référence du formulaire AVANT l'opération async
    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const priceString = formData.get("price") as string;

    if (!name?.trim()) {
      toast.error("Le nom est obligatoire");
      return;
    }
    if (name.trim().length > 100) {
      toast.error(
        `Le nom ne peut pas dépasser 100 caractères (actuellement: ${
          name.trim().length
        })`
      );
      return;
    }
    if (!description?.trim()) {
      toast.error("La description est obligatoire");
      return;
    }
    if (description.trim().length > 500) {
      toast.error(
        `La description ne peut pas dépasser 500 caractères (actuellement: ${
          description.trim().length
        })`
      );
      return;
    }

    const itemData: CreateWishlistItemInput = {
      name: name.trim(),
      description: description.trim(),
    };

    // Validation et ajout du prix si fourni
    if (priceString) {
      const price = Number(priceString);
      if (isNaN(price) || price <= 0) {
        toast.error("Le prix doit être un nombre positif");
        return;
      }
      itemData.price = price;
    }

    try {
      await addWishlistItem(wishlistId, itemData);
      toast.success("Article ajouté avec succès !");
      form.reset();
      onSuccess();
      window.location.reload();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Erreur lors de l'ajout"
      );
    }
  }

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
          disabled={pending}
          placeholder="Ex: Nintendo Switch"
        />
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
          disabled={pending}
          placeholder="Ex: Console de jeu portable"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">Prix (optionnel)</Label>
        <Input
          id="price"
          name="price"
          type="number"
          min="0"
          step="0.01"
          disabled={pending}
          placeholder="Ex: 299.99"
        />
      </div>

      <div className="flex gap-2 mt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => onSuccess()}
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
          onSuccess={() => setIsOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
