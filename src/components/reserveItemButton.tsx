"use client";

import { toggleItemReservationAction } from "@/actions/toggleItemReservation.action";
import { Button } from "@/components/ui/button";
import { Heart, HeartOff } from "lucide-react";
import { useOptimistic, useTransition } from "react";

interface ReserveItemButtonProps {
  itemId: string;
  isReserved: boolean;
  reservedByCurrentUser: boolean;
  reservedByName?: string;
}

export default function ReserveItemButton({
  itemId,
  isReserved,
  reservedByCurrentUser,
  reservedByName,
}: ReserveItemButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [optimisticReserved, setOptimisticReserved] = useOptimistic(
    isReserved,
    (currentState) => !currentState
  );

  const handleToggleReservation = () => {
    // Ne permettre l'action que si l'article n'est pas réservé ou si c'est l'utilisateur qui l'a réservé
    if (isReserved && !reservedByCurrentUser) {
      return;
    }

    startTransition(async () => {
      setOptimisticReserved(!optimisticReserved);

      const result = await toggleItemReservationAction(itemId);

      if (!result.success) {
        // Si l'action échoue, l'état sera automatiquement restauré
        console.error("Erreur:", result.error);
      }
    });
  };

  // Si l'article est réservé par quelqu'un d'autre, afficher un bouton désactivé
  if (isReserved && !reservedByCurrentUser) {
    return (
      <Button
        variant="secondary"
        size="sm"
        disabled
        className="flex items-center gap-1"
      >
        <Heart className="h-4 w-4 fill-current" />
        {reservedByName ? `Réservé par ${reservedByName}` : "Déjà réservé"}
      </Button>
    );
  }

  return (
    <Button
      variant={optimisticReserved ? "default" : "outline"}
      size="sm"
      onClick={handleToggleReservation}
      disabled={isPending}
      className="flex items-center gap-1 cursor-pointer"
    >
      {optimisticReserved ? (
        <>
          <Heart className="h-4 w-4 fill-current" />
          {reservedByCurrentUser ? "Annuler" : "Réservé"}
        </>
      ) : (
        <>
          <HeartOff className="h-4 w-4" />
          Réserver
        </>
      )}
    </Button>
  );
}
