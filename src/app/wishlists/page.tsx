import CreateWishlistForm from "@/components/createWishlistForm";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ListPlus } from "lucide-react";

export default function WishlistsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Mes listes</h1>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              className="cursor-pointer flex gap-0"
              aria-roledescription="Créer une wishlist"
            >
              <ListPlus className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="bottom"
            className="h-[calc(100dvh-82px)] p-8 flex flex-col justify-center"
          >
            <div className="max-w-120 mx-auto">
              <SheetHeader className="p-0">
                <SheetTitle className="text-2xl">Créer une wishlist</SheetTitle>
              </SheetHeader>
              <div className="mt-4">
                <CreateWishlistForm />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
