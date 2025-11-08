"use client";

import { Pen } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import UpdateWishlistForm, { type WishlistData } from "./updateWishlistForm";

interface UpdateListButtonProps {
  wishlistData: WishlistData;
}

export default function UpdateListButton({
  wishlistData,
}: UpdateListButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer" size={"sm"}>
          <Pen className="w-4 h-4 mr-2" />
          Modifier
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Modifier la liste</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <UpdateWishlistForm
            onSuccess={() => setIsOpen(false)}
            isOpen={isOpen}
            wishlistData={wishlistData}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
