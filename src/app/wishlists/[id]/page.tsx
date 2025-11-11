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
import { Skeleton } from "@/components/ui/skeleton";
import UpdateItemButton from "@/components/updateItemButton";
import UpdateListButton from "@/components/UpdateListButton";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

function WishlistHeaderSkeleton() {
  return (
    <div className="flex flex-col gap-4 items-center mb-1">
      <Skeleton className="h-[100px] w-[100px] rounded-full" />
      <div className="flex-1 text-center space-y-2">
        <Skeleton className="h-6 w-48 mx-auto" />
        <Skeleton className="h-5 w-32 mx-auto" />
        <Skeleton className="h-5 w-40 mx-auto" />
      </div>
      <Skeleton className="h-4 w-64" />
      <div className="flex gap-2">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  );
}

function WishlistItemsSkeleton() {
  return (
    <Card className="mt-4 p-4">
      <div className="space-y-4">
        <Skeleton className="h-10 w-32" />
        <ul className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <li key={i}>
              <div className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}

function WishlistPageSkeleton() {
  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <Skeleton className="h-9 w-20" />
        <Skeleton className="h-4 w-16" />
      </div>
      <div className="mt-4">
        <WishlistHeaderSkeleton />
      </div>
      <Skeleton className="h-16 w-full mt-4" />
      <WishlistItemsSkeleton />
    </section>
  );
}

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

interface EventInvitation {
  friendId: string;
  status: "PENDING" | "ACCEPTED" | "DECLINED";
  friend: {
    id: string;
    name: string;
  };
}

async function WishlistPageContent({
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

  // Si c'est une wishlist d'événement, vérifier les permissions d'accès
  if (wishlist.isEventWishlist && wishlist.eventId) {
    // Pour les wishlists d'événements, seuls l'hôte et les invités acceptés peuvent accéder
    if (!isOwner) {
      // Si l'utilisateur n'est pas le propriétaire, vérifier s'il a une invitation acceptée
      const event = wishlist.event;
      if (!event) {
        redirect("/wishlists");
      }

      const hasAcceptedInvitation = event.invitations?.some(
        (invitation: EventInvitation) =>
          invitation.friendId === session.user.id &&
          invitation.status === "ACCEPTED"
      );

      if (!hasAcceptedInvitation) {
        redirect("/wishlists");
      }
    }
  }
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

export default function WishlistIdPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<WishlistPageSkeleton />}>
      <WishlistPageContent params={params} />
    </Suspense>
  );
}
