import { getWishlistByIdAction } from "@/actions/getWishlistById.action";
import AddItemButton from "@/components/AddItemButton";
import DeleteItemButton from "@/components/deleteItemButton";
import DeleteListButton from "@/components/deleteListButton";
import ReserveItemButton from "@/components/reserveItemButton";
import ReturnButton from "@/components/returnButton";
import { Card } from "@/components/ui/card";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemTitle,
} from "@/components/ui/item";
import UpdateItemButton from "@/components/updateItemButton";
import UpdateListButton from "@/components/UpdateListButton";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Image from "next/image";
import { redirect } from "next/navigation";

interface WishlistItem {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  reserved: boolean;
  updatedAt: Date;
  wishlistId: string;
  reservation?: {
    id: string;
    reservedById: string | null;
    reservedBy: {
      id: string;
      name: string;
      avatar: {
        id: string;
        url: string;
      } | null;
    } | null;
    anonymous: boolean;
  } | null;
}

export default async function WishlistIdPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Récupérer la session utilisateur pour vérifier les permissions
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/login");
  }

  const wishlist = await getWishlistByIdAction(id);

  // Vérifier si l'utilisateur est le propriétaire de la liste
  const isOwner = wishlist.userId === session.user.id;
  return (
    <section>
      <ReturnButton href="/wishlists" label="Listes" />
      <div className="mt-4">
        <div className="flex flex-col gap-4 items-center mb-1">
          <Image
            src={wishlist.profile.avatar?.url || "/default-avatar.png"}
            alt={wishlist.profile.name}
            height={100}
            width={100}
          />
          <div className="flex-1">
            <h1 className="text-xl">{wishlist.name}</h1>
            <h2>Pour : {wishlist.profile.name}</h2>
            <p>Par : {wishlist.user.name}</p>
          </div>
          {wishlist.description && (
            <p className="text-center">Descripiton: {wishlist.description}</p>
          )}
          {isOwner && (
            <div className="flex gap-2">
              <UpdateListButton
                wishlistData={{
                  id: wishlist.id,
                  name: wishlist.name,
                  description: wishlist.description,
                  profileId: wishlist.profileId,
                }}
              />
              <DeleteListButton
                wishlistId={wishlist.id}
                wishlistName={wishlist.name}
              />
            </div>
          )}
        </div>
      </div>
      <p className="mt-4">
        {isOwner ? (
          <>
            Cette liste est visible par vous et l&apos;ensemble de vos amis. Vos
            amis peuvent interragir avec cette liste en indiquant qu&apos;ils
            vous ont acheté l&apos;un des articles qui y figurent.
          </>
        ) : (
          <>
            Voici la liste de votre ami{" "}
            <strong>{wishlist.user?.name || "un ami"}</strong>. Vous pouvez voir
            les articles qu&apos;il souhaite recevoir. Si vous souhaitez lui
            offrir quelque chose, vous pouvez réserver un article pour
            qu&apos;il ne soit pas acheté plusieurs fois.
          </>
        )}
      </p>
      <Card className="mt-4 p-4">
        {isOwner && <AddItemButton wishlistId={id} />}
        {wishlist.items.length === 0 ? (
          <p>
            {isOwner
              ? "Cette liste est vide, ajoutez des articles!"
              : "Cette liste est vide!"}
          </p>
        ) : (
          <ul className="space-y-2">
            {wishlist.items.map((item: WishlistItem) => (
              <li key={item.id}>
                <Item
                  variant={"muted"}
                  className={item.reserved ? "opacity-60 border-dashed" : ""}
                >
                  <ItemContent>
                    <ItemTitle
                      className={`font-bold ${
                        item.reserved
                          ? "line-through text-muted-foreground"
                          : ""
                      }`}
                    >
                      {item.name}
                    </ItemTitle>
                    {item.description && (
                      <ItemDescription>{item.description}</ItemDescription>
                    )}
                    {item.price && (
                      <ItemDescription>Prix: {item.price}€</ItemDescription>
                    )}
                  </ItemContent>
                  <ItemActions>
                    {isOwner ? (
                      <>
                        <UpdateItemButton item={item} />
                        <DeleteItemButton
                          wishlistId={item.wishlistId}
                          itemId={item.id}
                        />
                      </>
                    ) : (
                      <ReserveItemButton
                        itemId={item.id}
                        isReserved={item.reserved}
                        reservedByCurrentUser={
                          item.reservation?.reservedById === session.user.id
                        }
                        reservedByName={
                          item.reservation?.reservedById === session.user.id
                            ? item.reservation?.reservedBy?.name
                            : undefined
                        }
                      />
                    )}
                  </ItemActions>
                  {item.reserved && (
                    <ItemFooter className="flex justify-center">
                      <p className="text-center text-primary">
                        {isOwner
                          ? `${
                              item.reservation?.reservedBy?.name ||
                              "Un de vos amis"
                            } a réservé cet article pour vous!`
                          : item.reservation?.reservedById === session.user.id
                          ? "Vous avez réservé cet article"
                          : "Cet article est déjà réservé"}
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
