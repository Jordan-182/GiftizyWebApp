import { getWishlistsAction } from "@/actions/getWishlists.action";
import CreateWishlistButton from "@/components/CreateWishlistButton";
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
import { auth } from "@/lib/auth";
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

  const wishlists = await getWishlistsAction();
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Mes listes</h1>
        <CreateWishlistButton />
      </div>
      <ul className="space-y-2">
        {wishlists.length === 0
          ? "Vous n'avez aucune liste pour le moment"
          : wishlists.map((list) => (
              <li key={list.id}>
                <Item
                  variant={"muted"}
                  className="max-w-sm flex justify-between"
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
                    <UpdateListButton />
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
    </div>
  );
}
