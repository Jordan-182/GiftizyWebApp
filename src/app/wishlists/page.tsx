import CreateWishlistForm from "@/components/createWishlistForm";
import { Button } from "@/components/ui/button";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { auth } from "@/lib/auth";
import { wishlistService } from "@/services/wishlistService";
import { ListPlus } from "lucide-react";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function WishlistsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/login");
  }

  const wishlists = await wishlistService.getWishlistsByUser(session.user.id);
  console.log(wishlists);
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
      <ul>
        {wishlists.map((list) => (
          <li key={list.id}>
            <Link href={`/wishlists/${list.id}`}>
              <Item variant={"muted"} className="max-w-sm">
                <ItemMedia>
                  <Image
                    src={list.profile.avatar?.url || "./logo.png"}
                    alt={list.name}
                    height={50}
                    width={50}
                  />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>{list.name}</ItemTitle>
                  <ItemDescription>
                    Profil: {list.profile.name} <br />
                    Contient {list.items.length} item(s)
                  </ItemDescription>
                </ItemContent>
              </Item>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
