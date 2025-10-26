"use client";

import CreateWishlistForm from "@/components/createWishlistForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ListPlus } from "lucide-react";
import { useState } from "react";

export default function CreateWishlistButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className="cursor-pointer flex gap-0"
          aria-roledescription="Créer une wishlist"
        >
          <ListPlus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[80vh] sm:max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full">
        <DialogHeader>
          <DialogTitle className="text-2xl">Créer une wishlist</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <CreateWishlistForm
            onSuccess={() => setIsOpen(false)}
            isOpen={isOpen}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
