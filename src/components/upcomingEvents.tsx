import { getUpcomingEventsAction } from "@/actions/getUpcomingEvents.action";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, Crown, MapPin, User } from "lucide-react";
import Link from "next/link";

export default async function UpcomingEvents() {
  const result = await getUpcomingEventsAction();
  const events = result.data || [];

  const formatDate = (date: Date | string) => {
    const eventDate = new Date(date);
    return new Intl.DateTimeFormat("fr-FR", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(eventDate);
  };

  const getDaysUntilEvent = (date: Date | string) => {
    const eventDate = new Date(date);
    const now = new Date();
    const diffTime = eventDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Aujourd'hui";
    if (diffDays === 1) return "Demain";
    return `Dans ${diffDays} jours`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Événements à venir</h2>
        <Button asChild variant="outline" size="sm">
          <Link href="/events">Voir tous</Link>
        </Button>
      </div>

      {events.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center space-y-2">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto" />
              <p className="text-lg font-medium text-muted-foreground">
                Aucun événement prévu
              </p>
              <p className="text-sm text-muted-foreground">
                Créez votre premier événement ou attendez une invitation !
              </p>
              <div className="pt-4">
                <Button asChild>
                  <Link href="/events">Créer un événement</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {events.slice(0, 6).map((event) => (
            <Card
              key={event.id}
              className="transition-all duration-200 hover:shadow-md"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <CardTitle className="text-lg leading-tight">
                      {event.name}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          event.role === "host" ? "default" : "secondary"
                        }
                        className="text-xs"
                      >
                        {event.role === "host" ? (
                          <>
                            <Crown className="h-3 w-3 mr-1" />
                            Organisateur
                          </>
                        ) : (
                          <>
                            <User className="h-3 w-3 mr-1" />
                            Invité
                          </>
                        )}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0 space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(event.date)}</span>
                  </div>

                  {event.location && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span className="truncate">{event.location}</span>
                    </div>
                  )}

                  {event.role === "participant" && event.host && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <User className="h-4 w-4" />
                      <span>Organisé par {event.host.name}</span>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex items-center justify-between pt-2 mt-auto">
                <Badge variant="outline" className="text-xs">
                  {getDaysUntilEvent(event.date)}
                </Badge>

                <Button asChild size="sm" variant="outline">
                  <Link href={`/events/${event.id}`}>Voir</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {events.length > 6 && (
        <div className="text-center pt-4">
          <Button asChild variant="outline">
            <Link href="/events">
              Voir les {events.length - 6} autres événements
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
