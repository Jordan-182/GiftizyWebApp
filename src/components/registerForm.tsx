"use client";

import { signUpEmailAction } from "@/actions/signupEmail.action";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Spinner } from "./ui/spinner";

export default function RegisterForm() {
  const [isPending, setIsPending] = useState<boolean>(false);
  const [birthDate, setBirthDate] = useState<Date | undefined>(undefined);
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);
    const formData = new FormData(event.target as HTMLFormElement);
    if (birthDate) {
      formData.set("birthDate", format(birthDate, "yyyy-MM-dd"));
    }
    const { error } = await signUpEmailAction(formData);
    if (error) {
      toast.error(error);
      setIsPending(false);
    } else {
      toast.success(
        "Compte créé avec succès! Surveillez vos emails pour le lien de vérification."
      );
      router.push("/auth/register/success");
    }
    setIsPending(false);
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-sm w-full space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nom</Label>
        <Input type="text" id="name" name="name" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="birthDate">Date de naissance</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className="w-full justify-start text-left font-normal"
            >
              {birthDate ? format(birthDate, "dd/MM/yyyy") : "Choisir une date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0 z-999" align="start">
            <Calendar
              mode="single"
              selected={birthDate}
              onSelect={setBirthDate}
              captionLayout="dropdown"
              fromYear={1900}
              toYear={new Date().getFullYear()}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {/* Champ caché pour le submit */}
        <input
          type="hidden"
          name="birthDate"
          value={birthDate ? format(birthDate, "yyyy-MM-dd") : ""}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input type="email" id="email" name="email" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Mot de passe</Label>
        <Input type="password" id="password" name="password" />
      </div>
      <Button
        type="submit"
        className="w-full cursor-pointer"
        disabled={isPending}
      >
        {isPending ? <Spinner /> : "Créer mon compte"}
      </Button>
    </form>
  );
}
