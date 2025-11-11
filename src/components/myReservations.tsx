import { getMyReservationsAction } from "@/actions/getMyReservations.action";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, ExternalLink, Gift, Heart, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function MyReservations() {
  const result = await getMyReservationsAction();
  const reservations = result.data || [];

  const formatPrice = (price: number | null) => {
    if (!price) return null;
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(price);
  };

  const formatEventDate = (date: Date | string) => {
    return new Intl.DateTimeFormat("fr-FR", {
      dateStyle: "medium",
    }).format(new Date(date));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Mes réservations</h2>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Gift className="h-4 w-4" />
          <span>
            {reservations.length} article{reservations.length > 1 ? "s" : ""}{" "}
            réservé{reservations.length > 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {reservations.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center space-y-2">
              <Gift className="h-12 w-12 text-muted-foreground mx-auto" />
              <p className="text-lg font-medium text-muted-foreground">
                Aucune réservation
              </p>
              <p className="text-sm text-muted-foreground">
                Explorez les listes de vos amis pour réserver des cadeaux !
              </p>
              <div className="pt-4">
                <Button asChild>
                  <Link href="/friends">Voir les listes de mes amis</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {reservations.map((reservation) => {
            const item = reservation.item;
            const wishlist = item.wishlist;
            const owner = wishlist.profile || wishlist.user;

            return (
              <Card
                key={reservation.id}
                className="transition-all duration-200 hover:shadow-md"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    {item.image ? (
                      <div className="relative h-12 w-12 shrink-0 rounded-md overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-12 w-12 shrink-0 rounded-md bg-muted flex items-center justify-center">
                        <Gift className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base leading-tight">
                        {item.name}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          <Heart className="h-3 w-3 mr-1" />
                          Réservé
                        </Badge>
                        {item.price && (
                          <Badge variant="outline" className="text-xs">
                            {formatPrice(item.price)}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0 space-y-3">
                  {item.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {item.description}
                    </p>
                  )}

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <User className="h-4 w-4" />
                      <span>Pour {owner.name}</span>
                    </div>

                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Heart className="h-4 w-4" />
                      <span className="truncate">Liste : {wishlist.name}</span>
                    </div>

                    {wishlist.event && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>Événement : {wishlist.event.name}</span>
                        <Badge variant="outline" className="text-xs ml-auto">
                          {formatEventDate(wishlist.event.date)}
                        </Badge>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex items-center justify-between pt-2 mt-auto">
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/wishlists/${wishlist.id}`}>
                      Voir la liste
                    </Link>
                  </Button>

                  {item.url && (
                    <Button asChild size="sm" variant="ghost">
                      <Link
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Lien
                      </Link>
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      {reservations.length > 0 && (
        <div className="text-center pt-4">
          <p className="text-sm text-muted-foreground">
            💡 Conseil : Gardez un œil sur les dates des événements pour ne pas
            oublier d&apos;acheter vos cadeaux !
          </p>
        </div>
      )}
    </div>
  );
}
