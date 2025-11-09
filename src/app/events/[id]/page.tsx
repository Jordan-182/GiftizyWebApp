import { getEventByIdAction } from "@/actions/events.action";
import DeleteEventButton from "@/components/deleteEventButton";
import InviteFriendsButton from "@/components/inviteFriendsButton";
import LeaveEventButton from "@/components/leaveEventButton";
import RemoveInvitationButton from "@/components/removeInvitationButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import UpdateEventButton from "@/components/updateEventButton";
import { auth } from "@/lib/auth";
import { Check, Clock, X } from "lucide-react";
import { headers } from "next/headers";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function EventIdPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Récupérer la session utilisateur pour vérifier les permissions
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/login");
  }

  const event = await getEventByIdAction(id);

  if (!event) {
    redirect("/events");
  }

  // Vérifier les permissions d'accès
  const isHost = session.user.id === event.hostId;
  const hasAcceptedInvitation = event.invitations.some(
    (invitation) =>
      invitation.friendId === session.user.id &&
      invitation.status === "ACCEPTED"
  );

  // Rediriger si l'utilisateur n'est ni l'hôte ni un invité accepté
  if (!isHost && !hasAcceptedInvitation) {
    redirect("/events");
  }

  const formatDate = (date: Date) => {
    const formatted = new Intl.DateTimeFormat("fr-FR", {
      dateStyle: "full",
      timeStyle: "short",
    }).format(date);

    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  };

  return (
    <>
      <Card className="mb-4">
        <CardHeader>
          <Image
            src={event.profile?.avatar?.url || "/logo.png"}
            alt="Avatar"
            height={100}
            width={100}
            className="mx-auto border-4 border-primary rounded-full"
          />
          <CardTitle className="text-center text-2xl text-primary">
            {event.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {event.description && (
            <div>
              <h3 className="font-semibold text-lg mb-2">Description</h3>
              <p className="text-muted-foreground">{event.description}</p>
            </div>
          )}

          <div>
            <h3 className="font-semibold text-lg mb-2">Organisé pour</h3>
            <p>{event.profile?.name || "Aucun profil associé"}</p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Date et heure</h3>
            <p>{formatDate(event.date)}</p>
          </div>

          {event.location && (
            <div>
              <h3 className="font-semibold text-lg mb-2">Lieu</h3>
              <p>{event.location}</p>
            </div>
          )}

          {/* Actions pour l'hôte */}
          {session.user.id === event.hostId && (
            <div className="pt-4 border-t space-y-3">
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
                className="w-full cursor-pointer"
                showText={true}
              />
              <DeleteEventButton
                eventId={event.id}
                eventName={event.name}
                redirectAfterDelete={true}
                className="w-full cursor-pointer"
                showText={true}
              />
            </div>
          )}

          {/* Actions pour les invités acceptés */}
          {!isHost && hasAcceptedInvitation && (
            <div className="pt-4 border-t">
              <LeaveEventButton
                eventId={event.id}
                eventName={event.name}
                className="w-full cursor-pointer"
                showText={true}
              />
            </div>
          )}
        </CardContent>
      </Card>
      <Card className="gap-2 mb-4">
        <CardHeader>
          <CardTitle>Participants</CardTitle>
        </CardHeader>
        <CardContent>
          {event.invitations && event.invitations.length > 0 ? (
            <div className="space-y-4">
              {/* Invitations acceptées */}
              {event.invitations.filter((inv) => inv.status === "ACCEPTED")
                .length > 0 && (
                <div>
                  <h4 className="font-medium text-green-600 mb-2 flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    Acceptés (
                    {
                      event.invitations.filter(
                        (inv) => inv.status === "ACCEPTED"
                      ).length
                    }
                    )
                  </h4>
                  <div className="space-y-2 ml-6">
                    {event.invitations
                      .filter((inv) => inv.status === "ACCEPTED")
                      .map((invitation) => (
                        <div
                          key={invitation.friend.id}
                          className="flex items-center gap-3 justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                              {invitation.friend.avatar?.url ? (
                                <Image
                                  src={invitation.friend.avatar.url}
                                  alt={invitation.friend.name}
                                  width={32}
                                  height={32}
                                  className="w-8 h-8 rounded-full object-cover"
                                />
                              ) : (
                                <span className="text-xs font-medium text-primary">
                                  {invitation.friend.name
                                    .charAt(0)
                                    .toUpperCase()}
                                </span>
                              )}
                            </div>
                            <span>{invitation.friend.name}</span>
                          </div>
                          {session.user.id === event.hostId && (
                            <RemoveInvitationButton
                              eventId={event.id}
                              friendId={invitation.friend.id}
                              friendName={invitation.friend.name}
                            />
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Invitations en attente */}
              {event.invitations.filter((inv) => inv.status === "PENDING")
                .length > 0 && (
                <div>
                  <h4 className="font-medium text-yellow-600 mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    En attente (
                    {
                      event.invitations.filter(
                        (inv) => inv.status === "PENDING"
                      ).length
                    }
                    )
                  </h4>
                  <div className="space-y-2 ml-6">
                    {event.invitations
                      .filter((inv) => inv.status === "PENDING")
                      .map((invitation) => (
                        <div
                          key={invitation.friend.id}
                          className="flex items-center gap-3 justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                              {invitation.friend.avatar?.url ? (
                                <Image
                                  src={invitation.friend.avatar.url}
                                  alt={invitation.friend.name}
                                  width={32}
                                  height={32}
                                  className="w-8 h-8 rounded-full object-cover"
                                />
                              ) : (
                                <span className="text-xs font-medium text-primary">
                                  {invitation.friend.name
                                    .charAt(0)
                                    .toUpperCase()}
                                </span>
                              )}
                            </div>
                            <span>{invitation.friend.name}</span>
                          </div>
                          {session.user.id === event.hostId && (
                            <RemoveInvitationButton
                              eventId={event.id}
                              friendId={invitation.friend.id}
                              friendName={invitation.friend.name}
                            />
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Invitations refusées */}
              {event.invitations.filter((inv) => inv.status === "DECLINED")
                .length > 0 && (
                <div>
                  <h4 className="font-medium text-red-600 mb-2 flex items-center gap-2">
                    <X className="w-4 h-4" />
                    Refusés (
                    {
                      event.invitations.filter(
                        (inv) => inv.status === "DECLINED"
                      ).length
                    }
                    )
                  </h4>
                  <div className="space-y-2 ml-6">
                    {event.invitations
                      .filter((inv) => inv.status === "DECLINED")
                      .map((invitation) => (
                        <div
                          key={invitation.friend.id}
                          className="flex items-center gap-3 justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden opacity-60">
                              {invitation.friend.avatar?.url ? (
                                <Image
                                  src={invitation.friend.avatar.url}
                                  alt={invitation.friend.name}
                                  width={32}
                                  height={32}
                                  className="w-8 h-8 rounded-full object-cover"
                                />
                              ) : (
                                <span className="text-xs font-medium text-primary">
                                  {invitation.friend.name
                                    .charAt(0)
                                    .toUpperCase()}
                                </span>
                              )}
                            </div>
                            <span className="text-muted-foreground">
                              {invitation.friend.name}
                            </span>
                          </div>
                          {session.user.id === event.hostId && (
                            <RemoveInvitationButton
                              eventId={event.id}
                              friendId={invitation.friend.id}
                              friendName={invitation.friend.name}
                            />
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">
              Pas d&apos;invité pour l&apos;instant
            </p>
          )}

          {/* Bouton pour inviter des amis - seulement si l'utilisateur est l'hôte */}
          {session.user.id === event.hostId && (
            <div className="mt-6 pt-4 border-t">
              <InviteFriendsButton
                eventId={event.id}
                existingInvitations={event.invitations}
                currentUserId={session.user.id}
                className="w-full cursor-pointer"
              />
            </div>
          )}
        </CardContent>
      </Card>
      <Card className="gap-2">
        <CardHeader>
          <CardTitle>Liste de cadeaux</CardTitle>
        </CardHeader>
        <CardContent>
          {event.wishlist ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{event.wishlist.name}</h4>
                  {event.wishlist.description && (
                    <p className="text-sm text-muted-foreground">
                      {event.wishlist.description}
                    </p>
                  )}
                </div>
              </div>

              {event.wishlist.items && event.wishlist.items.length > 0 ? (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {event.wishlist.items.length} article(s) dans la liste
                  </p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Aucun article dans la liste pour le moment
                </p>
              )}

              <div className="pt-4 border-t">
                <a
                  href={`/wishlists/${event.wishlist.id}`}
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full cursor-pointer"
                >
                  Voir la liste de cadeaux
                </a>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">
              Aucune liste de cadeaux associée à cet événement
            </p>
          )}
        </CardContent>
      </Card>
    </>
  );
}
