import { getCommonEventsWithProfileAction } from "@/actions/events.action";
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
import { Skeleton } from "@/components/ui/skeleton";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

// Force le rendu dynamique car cette page utilise l'authentification
export const dynamic = "force-dynamic";

function ProfileHeaderSkeleton() {
  return (
    <Card className="flex flex-col justify-center items-center gap-2 mb-4">
      <Skeleton className="h-[120px] w-[120px] rounded-full" />
      <div className="text-center space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-32" />
      </div>
    </Card>
  );
}

function ProfileWishlistsSkeleton() {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>
          <h2>Listes</h2>
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-4 w-72" />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <li key={i}>
              <div className="p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-[50px] w-[50px] rounded" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-4 w-64" />
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function ProfileEventsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2>Evènements</h2>
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-4 w-56" />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {Array.from({ length: 1 }).map((_, i) => (
            <li key={i}>
              <div className="p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-[50px] w-[50px] rounded" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-36" />
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-4 w-56" />
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-28" />
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function UserProfilePageSkeleton() {
  return (
    <>
      <ProfileHeaderSkeleton />
      <ProfileWishlistsSkeleton />
      <ProfileEventsSkeleton />
    </>
  );
}

async function UserProfilePageContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profile = await getProfileByIdAction(id);
  const wishlists = await getWishlistsByProfileIdAction(id);
  const commonEvents = await getCommonEventsWithProfileAction(id);

  const session = await auth.api.getSession({
    headers: await headers(),
  });
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
          {commonEvents.length === 0 ? (
            <p>
              Vous n&apos;avez aucun événement en commun avec {profile.name}{" "}
              pour le moment
            </p>
          ) : (
            <ul className="space-y-2">
              {commonEvents.map((event) => (
                <li key={event.id}>
                  <Link href={`/events/${event.id}`}>
                    <Item variant={"muted"}>
                      <ItemMedia>
                        <Image
                          src={event.profile?.avatar?.url || "/logo.png"}
                          alt={event.profile?.name || event.name}
                          width={50}
                          height={50}
                        />
                      </ItemMedia>
                      <ItemContent>
                        <ItemTitle>{event.name}</ItemTitle>
                        <ItemDescription className="flex flex-col">
                          {event.description && (
                            <span>{event.description}</span>
                          )}
                          <span>
                            Date:{" "}
                            {event.date instanceof Date
                              ? event.date.toLocaleDateString("fr-FR", {
                                  weekday: "long",
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })
                              : new Date(event.date).toLocaleDateString(
                                  "fr-FR",
                                  {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  }
                                )}
                          </span>
                          {event.location && (
                            <span>Lieu: {event.location}</span>
                          )}
                          <span>
                            Organisé par:{" "}
                            {event.host.id === session?.user.id
                              ? "Vous"
                              : event.host.name}
                          </span>
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
    </>
  );
}

export default function UserProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<UserProfilePageSkeleton />}>
      <UserProfilePageContent params={params} />
    </Suspense>
  );
}
