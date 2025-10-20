import DeleteItemButton from "@/components/deleteItemButton";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemTitle,
} from "@/components/ui/item";
import { getWishList } from "@/lib/api/wishlists";
import { Pen, Plus } from "lucide-react";
import Image from "next/image";

interface WishlistItem {
  id: string;
  name: string;
  description: string;
  price: number;
  reserved: boolean;
  updatedAt: string;
  wishlistId: string;
}

export default async function WishlistIdPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const wishlist = await getWishList(id);
  return (
    <section>
      <div className="flex gap-4 items-center">
        <Image
          src={wishlist.profile.avatar.url}
          alt={wishlist.profile.name}
          height={80}
          width={80}
        />
        <div>
          <h1 className="text-xl">{wishlist.name}</h1>
          <h2>Profil : {wishlist.profile.name}</h2>
        </div>
      </div>
      <p className="mt-4">
        Cette liste est visible par vous et l&apos;ensemble de vos amis. Vos
        amis peuvent interragir avec cette liste en indiquant qu&apos;ils vous
        ont acheté l&apos;un des articles qui y figurent.
      </p>
      <Card className="mt-4 p-4">
        <Button className="max-w-sm mx-auto cursor-pointer">
          <Plus />
          Ajouter un article
        </Button>
        {wishlist.items.length === 0 ? (
          <p>Cette liste est vide, ajoutez des articles!</p>
        ) : (
          <ul className="space-y-2">
            {wishlist.items.map((item: WishlistItem) => (
              <li key={item.id}>
                <Item variant={"muted"}>
                  <ItemContent>
                    <ItemTitle className="font-bold">{item.name}</ItemTitle>
                    {item.description && (
                      <ItemDescription>{item.description}</ItemDescription>
                    )}
                    {item.price && (
                      <ItemDescription>Prix: {item.price}€</ItemDescription>
                    )}
                  </ItemContent>
                  <ItemActions>
                    <Button className="cursor-pointer" size={"icon"}>
                      <Pen />
                    </Button>
                    <DeleteItemButton
                      wishlistId={item.wishlistId}
                      itemId={item.id}
                    />
                  </ItemActions>
                  {item.reserved && (
                    <ItemFooter className="flex justify-center">
                      <p className="text-center text-primary">
                        Un de vos amis a réservé cet article pour vous!
                      </p>
                    </ItemFooter>
                  )}
                </Item>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </section>
  );
}
