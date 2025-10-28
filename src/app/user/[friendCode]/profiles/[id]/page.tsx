import { getWishlistsByProfileIdAction } from "@/actions/getWishlists.action";
import { getProfileByIdAction } from "@/actions/profiles.actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import Image from "next/image";
import Link from "next/link";

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profile = await getProfileByIdAction(id);
  const wishlists = await getWishlistsByProfileIdAction(id);
  return (
    <>
      <Card className="flex flex-col justify-center items-center gap-2 mb-4">
        <Image
          src={profile.avatar?.url || "/logo.png"}
          alt={profile.name}
          height={120}
          width={120}
        />
        <CardTitle>
          <h1 className="text-2xl text-center mb-1">{profile?.name}</h1>
          <h3>Profil géré par: {profile.user.name}</h3>
        </CardTitle>

        {profile.birthDate && (
          <CardDescription>
            <p>
              Date de naissance:{" "}
              {profile.birthDate instanceof Date
                ? profile.birthDate.toLocaleDateString("fr-FR")
                : profile.birthDate}
            </p>
          </CardDescription>
        )}
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>
            <h2>Listes</h2>
          </CardTitle>
          <CardDescription>
            <p>
              Consultez les listes de {profile.name} et réserver les articles
              que vous comptez lui offrir
            </p>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {wishlists.length === 0 ? (
            <p>{profile.name} n&apos;a pas créé de liste pour le moment</p>
          ) : (
            <ul className="space-y-2">
              {wishlists.map((list) => (
                <li key={list.id}>
                  <Link href={`/wishlists/${list.id}`}>
                    <Item variant={"muted"}>
                      <ItemMedia>
                        <Image
                          src={list.profile.avatar?.url || "/logo.png"}
                          alt={list.profile.name}
                          width={50}
                          height={50}
                        />
                      </ItemMedia>
                      <ItemContent>
                        <ItemTitle>{list.name}</ItemTitle>
                        {list.description && (
                          <ItemDescription>{list.description}</ItemDescription>
                        )}
                      </ItemContent>
                    </Item>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <h2>Evènements</h2>
          </CardTitle>
          <CardDescription>
            <p>
              Consultez les évènements que vous avez en commun avec{" "}
              {profile.name}
            </p>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li>Liste des évènements communs</li>
          </ul>
        </CardContent>
      </Card>
    </>
  );
}
