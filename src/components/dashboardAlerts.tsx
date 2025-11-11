import { getEventInvitationsAction } from "@/actions/events.action";
import { getReceivedPendingFriendRequestsAction } from "@/actions/getReceivedPendingFriendRequests.action";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, Users } from "lucide-react";
import Link from "next/link";

export default async function DashboardAlerts() {
  try {
    // Récupérer les demandes d'amis reçues en attente (pour les notifications)
    const friendRequestsResult = await getReceivedPendingFriendRequestsAction();
    const pendingFriendRequests = friendRequestsResult.success
      ? friendRequestsResult.data || []
      : [];

    // Récupérer les invitations aux événements en attente
    const eventInvitations = await getEventInvitationsAction();
    const pendingEventInvitations = eventInvitations.filter(
      (invitation) => invitation.status === "PENDING"
    );

    // Si aucune alerte, ne pas afficher la section
    if (
      pendingFriendRequests.length === 0 &&
      pendingEventInvitations.length === 0
    ) {
      return null;
    }

    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-muted-foreground">
          🔔 Notifications en attente
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Demandes d'amis en attente */}
          {pendingFriendRequests.length > 0 && (
            <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
              <CardContent className="flex items-center justify-between px-4">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-blue-600" />
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {pendingFriendRequests.length === 1
                        ? "1 demande d'ami"
                        : `${pendingFriendRequests.length} demandes d'amis`}
                    </span>
                  </div>
                </div>
                <Button asChild size="sm" variant="outline">
                  <Link href="/friends">Voir</Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Invitations aux événements en attente */}
          {pendingEventInvitations.length > 0 && (
            <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
              <CardContent className="flex items-center justify-between px-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-green-600" />
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {pendingEventInvitations.length === 1
                        ? "1 invitation à un événement"
                        : `${pendingEventInvitations.length} invitations aux événements`}
                    </span>
                  </div>
                </div>
                <Button asChild size="sm" variant="outline">
                  <Link href="/events">Voir</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Liste détaillée des invitations urgentes (événements dans les 7 prochains jours) */}
        {(() => {
          const urgentInvitations = pendingEventInvitations.filter(
            (invitation) => {
              const eventDate = new Date(invitation.event.date);
              const now = new Date();
              const diffTime = eventDate.getTime() - now.getTime();
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              return diffDays <= 7 && diffDays > 0;
            }
          );

          if (urgentInvitations.length === 0) return null;

          return (
            <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
              <CardContent className="px-4">
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-orange-600 mt-0.5" />
                  <div className="space-y-2 flex-1">
                    <p className="font-medium text-orange-800 dark:text-orange-200">
                      Événements urgents à confirmer :
                    </p>
                    <div className="space-y-2">
                      {urgentInvitations.map((invitation) => {
                        const eventDate = new Date(invitation.event.date);
                        const diffDays = Math.ceil(
                          (eventDate.getTime() - new Date().getTime()) /
                            (1000 * 60 * 60 * 24)
                        );

                        return (
                          <div
                            key={invitation.id}
                            className="flex items-center justify-between text-sm bg-white/50 dark:bg-black/20 rounded p-2"
                          >
                            <span>
                              <strong>{invitation.event.name}</strong> - dans{" "}
                              {diffDays} jour{diffDays > 1 ? "s" : ""}
                            </span>
                            <Button
                              asChild
                              size="sm"
                              variant="outline"
                              className="ml-2"
                            >
                              <Link href={`/events/${invitation.event.id}`}>
                                Répondre
                              </Link>
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })()}
      </div>
    );
  } catch (error) {
    console.error("Erreur lors du chargement des alertes:", error);
    return null;
  }
}
