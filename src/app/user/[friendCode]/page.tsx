import { checkFriendshipStatusAction } from "@/actions/checkFriendshipStatus.action";
import { getUserByFriendCodeAction } from "@/actions/getUserByFriendCode.action";
import { getWishlistsByUserAction } from "@/actions/getWishlists.action";
import { getProfilesAction } from "@/actions/profiles.actions";
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
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function UserFriendPage({
  params,
}: {
  params: Promise<{ friendCode: string }>;
}) {
  const { friendCode } = await params;
  const retrievedUser = await getUserByFriendCodeAction(friendCode);
  const profiles = await getProfilesAction(friendCode);
  const wishlists = await getWishlistsByUserAction(
    retrievedUser.data?.id || ""
  );
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/login");
  }

  if (!retrievedUser.success || !retrievedUser.data) {
    redirect("/friends");
  }

  const friendshipStatus = await checkFriendshipStatusAction(
    retrievedUser.data.id
  );

  if (!friendshipStatus.success || !friendshipStatus.data) {
    redirect("/friends");
  }

  const allowedStatuses = ["friend", "self"];
  if (!allowedStatuses.includes(friendshipStatus.data.status)) {
    redirect("/friends");
  }

  return (
    <>
      <Card className="flex flex-col justify-center items-center gap-2 mb-4">
        <Image
          src={retrievedUser.data.avatar?.url || "/logo.png"}
          alt={retrievedUser.data.name}
          height={120}
          width={120}
        />
        <CardTitle>
          <h1 className="text-2xl">{retrievedUser.data?.name}</h1>
        </CardTitle>

        {retrievedUser.data.birthDate && (
          <CardDescription>
            <p>
              Date de naissance:{" "}
              {retrievedUser.data.birthDate instanceof Date
                ? retrievedUser.data.birthDate.toLocaleDateString("fr-FR")
                : retrievedUser.data.birthDate}
            </p>
          </CardDescription>
        )}
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>
            <h2>Profils</h2>
          </CardTitle>
          <CardDescription>
            <p>
              Consultez les différents profils gérés par{" "}
              {retrievedUser.data.name}
            </p>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {profiles.length === 0 ? (
            <p>
              {retrievedUser.data.name} n&apos;a pas créé de profil pour le
              moment
            </p>
          ) : (
            <ul className="space-y-2">
              {profiles.map((profile) => (
                <li key={profile.id}>
                  <Link
                    href={`/user/${retrievedUser.data.friendCode}/profiles/${profile.id}`}
                  >
                    <Item variant={"muted"}>
                      <ItemMedia>
                        <Image
                          src={profile.avatar?.url || "/logo.png"}
                          alt={profile.name}
                          width={50}
                          height={50}
                        />
                      </ItemMedia>
                      <ItemContent>
                        <ItemTitle>{profile.name}</ItemTitle>
                        <ItemDescription className="flex flex-col">
                          {profile.isMainProfile && (
                            <span>Profil principal</span>
                          )}
                          {profile.birthDate && (
                            <span>
                              {" "}
                              Date de naissance:{" "}
                              {profile.birthDate instanceof Date
                                ? profile.birthDate.toLocaleDateString("fr-FR")
                                : profile.birthDate}
                            </span>
                          )}
                        </ItemDescription>
                      </ItemContent>
                    </Item>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>
            <h2>Listes</h2>
          </CardTitle>
          <CardDescription>
            <p>
              Consultez les listes de {retrievedUser.data.name} et réserver les
              articles que vous comptez lui offrir
            </p>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {wishlists.length === 0 ? (
            <p>
              {retrievedUser.data.name} n&apos;a pas créé de liste pour le
              moment
            </p>
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
              {retrievedUser.data.name}
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
