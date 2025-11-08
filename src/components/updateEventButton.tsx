"use client";

import { Pen } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import UpdateEventForm, { type EventData } from "./updateEventForm";

interface UpdateEventButtonProps {
  eventData: EventData;
  className?: string;
  showText?: boolean;
}

export default function UpdateEventButton({
  eventData,
  className,
  showText = false,
}: UpdateEventButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className={className || "h-8 w-8 cursor-pointer"}
          size={showText ? "sm" : "icon"}
          variant="outline"
        >
          <Pen className="h-4 w-4" />
          {showText && <span className="ml-1">Modifier</span>}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] mt-8">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Modifier l&apos;événement
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <UpdateEventForm
            onSuccess={() => setIsOpen(false)}
            isOpen={isOpen}
            eventData={eventData}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
