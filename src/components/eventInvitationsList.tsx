"use client";

import {
  getEventInvitationsAction,
  respondToEventInvitationAction,
} from "@/actions/events.action";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Check, Clock, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Spinner } from "./ui/spinner";

type EventInvitation = {
  id: string;
  status: string;
  event: {
    id: string;
    name: string;
    date: Date;
    location: string | null;
    host: {
      id: string;
      name: string;
    };
    profile: {
      id: string;
      name: string;
    } | null;
  };
};

export default function EventInvitationsList() {
  const [invitations, setInvitations] = useState<EventInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [respondingTo, setRespondingTo] = useState<string | null>(null);

  useEffect(() => {
    loadInvitations();
  }, []);

  const loadInvitations = async () => {
    try {
      const result = await getEventInvitationsAction();
      setInvitations(result || []);
    } catch (error) {
      console.error("Erreur lors du chargement des invitations:", error);
      toast.error("Erreur lors du chargement des invitations");
    } finally {
      setLoading(false);
    }
  };

  const handleResponse = async (
    eventId: string,
    invitationId: string,
    status: "ACCEPTED" | "DECLINED"
  ) => {
    setRespondingTo(invitationId);

    try {
      const formData = new FormData();
      formData.append("eventId", eventId);
      formData.append("status", status);

      const result = await respondToEventInvitationAction(
        { success: false },
        formData
      );

      if (result.success) {
        toast.success(result.message || "Réponse enregistrée");
        // Recharger les invitations
        await loadInvitations();
      } else {
        toast.error(result.error || "Erreur lors de la réponse");
      }
    } catch (error) {
      toast.error("Erreur lors de la réponse à l'invitation");
      console.error(error);
    } finally {
      setRespondingTo(null);
    }
  };

  const formatDate = (date: Date) => {
    return format(new Date(date), "EEEE d MMMM yyyy 'à' HH:mm", { locale: fr });
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Invitations reçues
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-4">
            Chargement des invitations...
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Invitations en attente (
          {invitations.filter((inv) => inv.status === "PENDING").length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {invitations.filter((inv) => inv.status === "PENDING").length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Aucune invitation en attente
          </p>
        ) : (
          <div className="space-y-4">
            {invitations
              .filter((invitation) => invitation.status === "PENDING")
              .map((invitation) => (
                <div
                  key={invitation.id}
                  className="border rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/events/${invitation.event.id}`}
                          className="font-semibold text-lg hover:text-primary cursor-pointer"
                        >
                          {invitation.event.name}
                        </Link>
                        <Clock className="w-4 h-4 text-yellow-600" />
                        <span className="text-sm text-muted-foreground">
                          En attente de réponse
                        </span>
                      </div>

                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>
                          <strong>Organisé par:</strong>{" "}
                          {invitation.event.host.name}
                        </p>
                        {invitation.event.profile && (
                          <p>
                            <strong>Pour:</strong>{" "}
                            {invitation.event.profile.name}
                          </p>
                        )}
                        <p>
                          <strong>Date:</strong>{" "}
                          {formatDate(invitation.event.date)}
                        </p>
                        {invitation.event.location && (
                          <p>
                            <strong>Lieu:</strong> {invitation.event.location}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2 border-t">
                    <Button
                      size="sm"
                      onClick={() =>
                        handleResponse(
                          invitation.event.id,
                          invitation.id,
                          "ACCEPTED"
                        )
                      }
                      disabled={respondingTo === invitation.id}
                      className="flex-1 cursor-pointer"
                    >
                      {respondingTo === invitation.id ? (
                        <Spinner />
                      ) : (
                        <span className="flex items-center">
                          <Check className="w-4 h-4 mr-2" /> Accepter
                        </span>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        handleResponse(
                          invitation.event.id,
                          invitation.id,
                          "DECLINED"
                        )
                      }
                      disabled={respondingTo === invitation.id}
                      className="flex-1 cursor-pointer"
                    >
                      {respondingTo === invitation.id ? (
                        <Spinner />
                      ) : (
                        <span className="flex items-center">
                          <X className="w-4 h-4 mr-2" />
                          Refuser
                        </span>
                      )}
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
