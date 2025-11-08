"use client";

import CreateEventForm from "@/components/createEventForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CalendarPlus } from "lucide-react";
import { useState } from "react";

export default function CreateEventButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className="cursor-pointer flex gap-0"
          aria-roledescription="Créer un événement"
        >
          <CalendarPlus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[85vh] sm:max-h-[90vh] mt-8 overflow-y-auto w-[95vw] sm:w-full">
        <DialogHeader>
          <DialogTitle className="text-2xl">Créer un événement</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <CreateEventForm onSuccess={() => setIsOpen(false)} isOpen={isOpen} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
