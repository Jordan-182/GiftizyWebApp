import { getFriendsEventsAction } from "@/actions/events.action";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Calendar, Clock, MapPin, User } from "lucide-react";
import Link from "next/link";

export default async function FriendsEventsList() {
  const friendsEvents = await getFriendsEventsAction();

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("fr-FR", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  };

  const isEventPast = (date: Date) => {
    return date < new Date();
  };

  if (friendsEvents.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>Aucun événement trouvé chez vos amis</p>
        <p className="text-sm mt-2">
          Vous n&apos;avez pas encore accepté d&apos;invitations à des
          événements
        </p>
      </div>
    );
  }

  return (
    <ul className="flex justify-center flex-wrap gap-2">
      {friendsEvents.map((event) => (
        <li key={event.id}>
          <Item
            variant="muted"
            className={`max-w-sm min-w-2xs ${
              isEventPast(event.date) ? "opacity-60" : ""
            }`}
          >
            <Link href={`/events/${event.id}`} className="flex gap-4 w-full">
              <ItemMedia>
                <div className="h-[50px] w-[50px] rounded-md bg-primary/10 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
              </ItemMedia>
              <ItemContent>
                <ItemTitle
                  className={isEventPast(event.date) ? "line-through" : ""}
                >
                  {event.name}
                </ItemTitle>
                <ItemDescription>
                  <span className="flex items-center gap-1 text-xs">
                    <User className="h-3 w-3" />
                    Par: {event.host.name}
                  </span>
                  <span className="flex items-center gap-1 text-xs mt-1">
                    <Clock className="h-3 w-3" />
                    {formatDate(event.date)}
                  </span>
                  {event.location && (
                    <span className="flex items-center gap-1 text-xs mt-1">
                      <MapPin className="h-3 w-3" />
                      {event.location}
                    </span>
                  )}
                  {event.profile && (
                    <span className="text-xs mt-1 inline-block">
                      Profil: {event.profile.name}
                    </span>
                  )}
                </ItemDescription>
              </ItemContent>
            </Link>
          </Item>
        </li>
      ))}
    </ul>
  );
}
