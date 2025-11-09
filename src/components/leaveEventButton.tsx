"use client";

import {
  leaveEventAction,
  type LeaveEventState,
} from "@/actions/events.action";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";

interface LeaveEventButtonProps {
  eventId: string;
  eventName: string;
  className?: string;
  showText?: boolean;
}

function LeaveButton() {
  const { pending } = useFormStatus();
  return (
    <AlertDialogAction asChild>
      <Button
        variant="destructive"
        disabled={pending}
        className="cursor-pointer w-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
      >
        {pending ? <Spinner className="w-4 h-4" /> : "Quitter"}
      </Button>
    </AlertDialogAction>
  );
}

export default function LeaveEventButton({
  eventId,
  eventName,
  className,
  showText = false,
}: LeaveEventButtonProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const [state, formAction] = useActionState<LeaveEventState, FormData>(
    leaveEventAction,
    {
      success: false,
    }
  );

  // Gérer la redirection et les notifications
  useEffect(() => {
    if (state.success) {
      toast.success(
        state.message || "Vous avez quitté l'événement avec succès"
      );
      setIsOpen(false);
      if (state.shouldRedirect) {
        router.push("/events");
      }
    } else if (state.error && !state.success) {
      toast.error(state.error);
    }
  }, [state, router]);

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          className={className}
          onClick={() => setIsOpen(true)}
        >
          <LogOut className="w-4 h-4" />
          {showText && <span className="ml-2">Quitter l&apos;événement</span>}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Quitter l&apos;événement</AlertDialogTitle>
          <AlertDialogDescription>
            Êtes-vous sûr de vouloir quitter l&apos;événement{" "}
            <span className="font-semibold">{eventName}</span> ?
            <br />
            <br />
            Cette action supprimera votre participation et vous n&apos;aurez
            plus accès à cet événement ni à sa liste de cadeaux.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">
            Annuler
          </AlertDialogCancel>
          <form action={formAction}>
            <input type="hidden" name="eventId" value={eventId} />
            <LeaveButton />
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
