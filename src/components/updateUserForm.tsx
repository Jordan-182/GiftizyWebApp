"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { updateUser } from "@/lib/auth-client";
import { format, parseISO } from "date-fns";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { Spinner } from "./ui/spinner";

interface UpdateUserFormProps {
  name: string;
  birthDate?: string; // format YYYY-MM-DD
}

export default function UpdateUserForm({
  name,
  birthDate,
}: UpdateUserFormProps) {
  const [isPending, setIsPending] = useState<boolean>(false);
  const [birthDateState, setBirthDateState] = useState<Date | undefined>(
    birthDate ? parseISO(birthDate) : undefined
  );
  const router = useRouter();

  // Variable accessible dans tout le composant
  const birthDateValueString = birthDateState
    ? format(birthDateState, "yyyy-MM-dd")
    : "";

  // Met à jour la date si la prop change
  React.useEffect(() => {
    if (typeof window !== "undefined" && birthDate) {
      setBirthDateState(birthDate ? parseISO(birthDate) : undefined);
    }
  }, [birthDate]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const name = String(formData.get("name"));

    // On envoie la date au format string 'YYYY-MM-DD' pour éviter le décalage UTC
    if (!name && !birthDateValueString) {
      return toast.error("Veuillez renseigner au moins un champ.");
    }

    await updateUser({
      ...(name && { name }),
      ...(birthDateValueString && {
        birthDate: new Date(birthDateValueString),
      }),
      fetchOptions: {
        onRequest: () => {
          setIsPending(true);
        },
        onResponse: () => {
          setIsPending(false);
        },
        onError: (context) => {
          toast.error(context.error.message);
        },
        onSuccess: () => {
          toast.success("Profil mis à jour!");
          (event.target as HTMLFormElement).reset();
          router.refresh();
        },
      },
    });
  }

  return (
    <form className="max-w-sm w-full space-y-4" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Nom</Label>
        <Input id="name" name="name" defaultValue={name} />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="birthDate">Date de naissance</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className="w-full justify-start text-left font-normal"
            >
              {birthDateState
                ? format(birthDateState, "dd/MM/yyyy")
                : "Choisir une date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0" align="start">
            <Calendar
              mode="single"
              selected={birthDateState}
              onSelect={setBirthDateState}
              captionLayout="dropdown"
              fromYear={1900}
              toYear={new Date().getFullYear()}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {/* Champ caché pour le submit */}
        <input type="hidden" name="birthDate" value={birthDateValueString} />
      </div>

      <Button
        type="submit"
        disabled={isPending}
        className="cursor-pointer w-36"
      >
        {!isPending ? <p>Mettre à jour</p> : <Spinner />}
      </Button>
    </form>
  );
}
