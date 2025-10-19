import CreateWishlistForm from "@/components/createWishlistForm";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ListPlus } from "lucide-react";

export default function WishlistsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Mes listes</h1>
        <Drawer>
          <DrawerTrigger asChild>
            <Button
              className="cursor-pointer flex gap-0"
              aria-roledescription="Ajouter un ami"
            >
              <ListPlus className="h-4 w-4" />
            </Button>
          </DrawerTrigger>
          <DrawerContent className="mb-20">
            <DrawerHeader>
              <DrawerTitle>Créer une wishlist</DrawerTitle>
              <DrawerDescription>
                Créez une wishlist pour vous ou l&apos;un de vos profils
              </DrawerDescription>
            </DrawerHeader>
            <div className="px-4 pb-4">
              <CreateWishlistForm />
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
}
