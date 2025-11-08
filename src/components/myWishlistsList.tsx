import { getWishlistsAction } from "@/actions/getWishlists.action";
import DeleteListButton from "@/components/deleteListButton";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import UpdateListButton from "@/components/UpdateListButton";
import { Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function MyWishlistsList() {
  const wishlists = await getWishlistsAction();

  return (
    <div className="space-y-4">
      {wishlists.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>Vous n&apos;avez aucune liste pour le moment</p>
          <p className="text-sm mt-2">
            Créez votre première liste en cliquant sur le bouton ci-dessus
          </p>
        </div>
      ) : (
        <ul className="flex justify-center flex-wrap gap-2">
          {wishlists.map((list) => (
            <li key={list.id}>
              <Item variant={"muted"} className="w-72 h-44">
                <Link
                  href={`/wishlists/${list.id}`}
                  className="flex gap-4 flex-1 p-3"
                >
                  <ItemMedia className="shrink-0">
                    <Image
                      src={list.profile.avatar?.url || "./logo.png"}
                      alt={list.name}
                      height={50}
                      width={50}
                    />
                  </ItemMedia>
                  <ItemContent className="flex-1 min-w-0">
                    <ItemTitle className="flex items-center gap-2">
                      {list.name}
                      {list.isEventWishlist && (
                        <Calendar
                          className="w-4 h-4 text-primary"
                          aria-label="Liste d'événement"
                        />
                      )}
                    </ItemTitle>
                    <ItemDescription>
                      Pour: {list.profile.name} <br />
                      Contient {list.items.length} item(s)
                      {list.isEventWishlist && (
                        <>
                          <br />
                          <span className="text-primary text-xs font-medium">
                            📅 Liste d&apos;événement
                          </span>
                        </>
                      )}
                    </ItemDescription>
                  </ItemContent>
                </Link>
                <ItemActions className="flex flex-1 rounded-sm items-center justify-center">
                  <UpdateListButton
                    wishlistData={{
                      id: list.id,
                      name: list.name,
                      description: list.description,
                      profileId: list.profileId,
                    }}
                  />
                  <DeleteListButton
                    wishlistId={list.id}
                    wishlistName={list.name}
                    redirectAfterDelete={false}
                  />
                </ItemActions>
              </Item>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
