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
              <Item
                variant={"muted"}
                className="max-w-sm min-w-2xs flex justify-between"
              >
                <Link href={`/wishlists/${list.id}`} className="flex gap-4">
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
                </Link>
                <ItemActions>
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
