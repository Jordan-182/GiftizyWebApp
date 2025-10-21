"use client";

import { addWishlistItem } from "@/lib/api/wishlistItems";
import type { CreateWishlistItemInput } from "@/schemas";
import { Plus } from "lucide-react";
import { useState } from "react";
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

interface AddItemButtonProps {
  wishlistId: string;
}

export default function AddItemButton({ wishlistId }: AddItemButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);

    // Stocker la référence du formulaire AVANT l'opération async
    const form = event.currentTarget;

    const formData = new FormData(form);
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const priceString = formData.get("price") as string;

    // Validation côté client
    if (!name?.trim()) {
      toast.error("Le nom est obligatoire");
      setIsPending(false);
      return;
    }
    if (!description?.trim()) {
      toast.error("La description est obligatoire");
      setIsPending(false);
      return;
    }

    const itemData: CreateWishlistItemInput = {
      name: name.trim(),
      description: description.trim(),
    };

    // Ajout du prix si fourni
    if (priceString && !isNaN(Number(priceString))) {
      const price = Number(priceString);
      if (price > 0) {
        itemData.price = price;
      }
    }

    try {
      await addWishlistItem(wishlistId, itemData);
      toast.success("Article ajouté avec succès !");

      // Fermer le modal et reset le formulaire
      setIsOpen(false);
      form.reset(); // Utiliser la référence stockée

      // Recharger la page pour voir le nouvel article
      window.location.reload();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Erreur lors de l'ajout"
      );
      setIsPending(false);
    }
  }
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button className="max-w-sm mx-auto cursor-pointer">
          <Plus />
          Ajouter un article
        </Button>
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="h-[calc(100dvh-82px)] p-8 flex flex-col items-center justify-center gap-6"
      >
        <SheetHeader className="p-0">
          <SheetTitle className="text-2xl">Ajouter un article</SheetTitle>
        </SheetHeader>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 mt-4 w-full max-w-md"
        >
          <div className="space-y-2">
            <Label htmlFor="name">
              Nom de l'article <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              required
              maxLength={100}
              disabled={isPending}
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
              maxLength={500}
              disabled={isPending}
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
              disabled={isPending}
              placeholder="Ex: 299.99"
            />
          </div>

          <div className="flex gap-2 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
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
      </SheetContent>
    </Sheet>
  );
}
