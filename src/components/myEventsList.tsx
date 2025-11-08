import { getUserEventsAction } from "@/actions/events.action";
import DeleteEventButton from "@/components/deleteEventButton";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import UpdateEventButton from "@/components/updateEventButton";
import { Calendar, Clock, MapPin } from "lucide-react";
import Link from "next/link";

export default async function MyEventsList() {
  const events = await getUserEventsAction();

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("fr-FR", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  };

  const isEventPast = (date: Date) => {
    return date < new Date();
  };

  return (
    <div className="space-y-4">
      {events.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>Vous n&apos;avez aucun événement pour le moment</p>
          <p className="text-sm mt-2">
            Créez votre premier événement en cliquant sur le bouton ci-dessus
          </p>
        </div>
      ) : (
        <ul className="flex justify-center flex-wrap gap-2">
          {events.map((event) => (
            <li key={event.id}>
              <Item
                variant="muted"
                className={`max-w-sm min-w-2xs flex justify-between ${
                  isEventPast(event.date) ? "opacity-60" : ""
                }`}
              >
                <Link href={`/events/${event.id}`} className="flex gap-4">
                  <ItemMedia>
                    <div className="h-[50px] w-[50px] rounded-md bg-primary/10 flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-primary" />
                    </div>
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle
                      className={
                        isEventPast(event.date) ? "line-through opacity-60" : ""
                      }
                    >
                      {event.name}
                    </ItemTitle>
                    <ItemDescription>
                      <span className="flex items-center gap-1 text-xs">
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
                          Organisé pour: {event.profile.name}
                        </span>
                      )}
                    </ItemDescription>
                  </ItemContent>
                </Link>
                <ItemActions className="flex w-full gap-1">
                  <UpdateEventButton
                    eventData={{
                      id: event.id,
                      name: event.name,
                      description: event.description || "",
                      date: `${event.date.getFullYear()}-${(
                        event.date.getMonth() + 1
                      )
                        .toString()
                        .padStart(2, "0")}-${event.date
                        .getDate()
                        .toString()
                        .padStart(2, "0")}T${event.date
                        .getHours()
                        .toString()
                        .padStart(2, "0")}:${event.date
                        .getMinutes()
                        .toString()
                        .padStart(2, "0")}`,
                      location: event.location || "",
                      profileId: event.profileId || "",
                    }}
                    className="flex-1 h-auto px-2 py-1 cursor-pointer"
                    showText={true}
                  />
                  <DeleteEventButton
                    eventId={event.id}
                    eventName={event.name}
                    redirectAfterDelete={false}
                    className="flex-1 h-auto px-2 py-1 cursor-pointer"
                    showText={true}
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
