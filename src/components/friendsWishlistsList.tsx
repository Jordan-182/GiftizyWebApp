import { getFriendsWishlistsActionRealTime } from "@/actions/getFriendsWishlists.action";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import Image from "next/image";
import Link from "next/link";

export default async function FriendsWishlistsList() {
  const friendsWishlists = await getFriendsWishlistsActionRealTime();

  if (friendsWishlists.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>Aucune liste trouvée chez vos amis</p>
        <p className="text-sm mt-2">
          Vos amis n&apos;ont pas encore créé de listes ou vous n&apos;avez pas
          d&apos;amis
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {friendsWishlists.map((list) => (
        <li key={list.id}>
          <Item variant={"muted"} className="max-w-sm">
            <Link href={`/wishlists/${list.id}`} className="flex gap-4 w-full">
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
                  Par: {list.user.name} <br />
                  Pour: {list.profile.name} <br />
                  Contient {list.items.length} item(s)
                </ItemDescription>
              </ItemContent>
            </Link>
          </Item>
        </li>
      ))}
    </ul>
  );
}
