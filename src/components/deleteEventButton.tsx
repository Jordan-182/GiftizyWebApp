"use client";

import {
  deleteEventAction,
  type DeleteEventState,
} from "@/actions/events.action";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Spinner } from "./ui/spinner";

interface DeleteEventButtonProps {
  eventId: string;
  eventName: string;
  redirectAfterDelete?: boolean; // Par défaut true, false si on est sur la page liste
  className?: string;
  showText?: boolean;
}

function DeleteButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      variant="destructive"
      disabled={pending}
      className="w-full cursor-pointer"
    >
      {pending ? <Spinner /> : "Supprimer définitivement"}
    </Button>
  );
}

export default function DeleteEventButton({
  eventId,
  eventName,
  redirectAfterDelete = true,
  className,
  showText = false,
}: DeleteEventButtonProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const initialState: DeleteEventState = {
    success: false,
  };

  const [state, formAction] = useActionState(deleteEventAction, initialState);

  useEffect(() => {
    if (state.success) {
      setIsOpen(false);
      if (redirectAfterDelete) {
        router.push("/events");
      }
    }
  }, [state.success, router, redirectAfterDelete]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="destructive"
          size={showText ? "sm" : "icon"}
          className={className || "h-8 w-8 cursor-pointer"}
          aria-label="Supprimer l'événement"
        >
          <Trash2 className="h-4 w-4" />
          {showText && <span className="ml-1">Supprimer</span>}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Supprimer l&apos;événement</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer l&apos;événement &quot;
            {eventName}&quot; ? Cette action est irréversible.
          </DialogDescription>
        </DialogHeader>
        {state.error && (
          <div className="text-sm text-red-500 mt-2">{state.error}</div>
        )}
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            className="cursor-pointer flex-1"
          >
            Annuler
          </Button>
          <form action={formAction} className="flex-1">
            <input type="hidden" name="id" value={eventId} />
            <DeleteButton />
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
