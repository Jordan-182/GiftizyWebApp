"use client";

import {
  createProfileAction,
  type ProfileActionResult,
} from "@/actions/profiles.actions";
import type { Avatar } from "@/generated/prisma";
import { format } from "date-fns";
import Image from "next/image";
import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet";
import { Spinner } from "./ui/spinner";

// Composant pour le bouton submit qui utilise useFormStatus
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="cursor-pointer">
      {pending ? (
        <>
          <Spinner className="mr-2" />
          Création...
        </>
      ) : (
        "Créer le profil"
      )}
    </Button>
  );
}

export default function CreateProfileModal({
  friendCode,
  avatars,
}: {
  friendCode: string;
  avatars: Avatar[];
}) {
  const [open, setOpen] = useState(false);
  const [profileName, setProfileName] = useState<string>("");
  const [selectedAvatarId, setSelectedAvatarId] = useState<string>(
    "cl2k5a8q00001x0u7d9a7p8z1"
  );
  const [birthDateState, setBirthDateState] = useState<Date | undefined>(
    undefined
  );

  // État pour la Server Action
  const initialState: ProfileActionResult = { success: false };
  const [state, formAction] = useActionState(createProfileAction, initialState);

  // Ref pour éviter les effets de bord multiples et tracker les soumissions
  const hasProcessedSuccess = useRef(false);
  const submissionCount = useRef(0);

  // Format pour le champ caché
  const birthDateValueString = birthDateState
    ? format(birthDateState, "yyyy-MM-dd")
    : "";

  // Fonction pour reset complètement le formulaire
  const resetForm = () => {
    setProfileName("");
    setBirthDateState(undefined);
    setSelectedAvatarId("cl2k5a8q00001x0u7d9a7p8z1");
    hasProcessedSuccess.current = false;
  };

  // Wrapper pour la Server Action qui force le reset
  const handleFormAction = async (formData: FormData) => {
    // Incrémenter le compteur de soumission
    submissionCount.current += 1;

    // Reset du flag pour cette nouvelle soumission
    hasProcessedSuccess.current = false;

    // Appeler la Server Action
    await formAction(formData);
  };

  // Gestion des effets de bord du state avec useEffect
  useEffect(() => {
    // Vérifier si c'est un nouveau succès (avec profileId pour s'assurer que c'est réel)
    if (state.success && state.profileId && !hasProcessedSuccess.current) {
      hasProcessedSuccess.current = true;
      toast.success("Profil créé avec succès !");

      // Reset du formulaire et fermeture du modal après un court délai
      setTimeout(() => {
        resetForm();
        setOpen(false);
      }, 1000); // Délai pour voir le toast
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state.success, state.error, state.profileId]);

  // Reset du formulaire quand on ouvre le modal
  useEffect(() => {
    if (open) {
      resetForm();
    }
  }, [open]);

  return (
    <>
      <Button onClick={() => setOpen(true)} className="mt-auto cursor-pointer">
        Créer un profil
      </Button>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="bottom"
          className="h-[calc(100dvh-82px)] p-8 flex flex-col justify-center"
        >
          <div className="max-w-120 mx-auto">
            <SheetHeader className="p-0">
              <SheetTitle className="text-2xl">Créer un profil</SheetTitle>
            </SheetHeader>
            <form
              action={handleFormAction}
              className="flex flex-col gap-4 mt-4"
            >
              {/* Champ caché pour le friendCode */}
              <input type="hidden" name="friendCode" value={friendCode} />
              <input type="hidden" name="avatarId" value={selectedAvatarId} />
              <input type="hidden" name="isMainProfile" value="false" />

              <Label htmlFor="name">Nom</Label>
              <Input
                name="name"
                placeholder="Nom du profil"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                required
              />
              {state.fieldErrors?.name && (
                <p className="text-sm text-red-500">{state.fieldErrors.name}</p>
              )}
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
                  <PopoverContent className="p-0 z-999" align="start">
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
                <input
                  type="hidden"
                  name="birthDate"
                  value={birthDateValueString}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Choisir un avatar</Label>
                <ul className="flex flex-wrap justify-center gap-2">
                  {avatars.map((avatar) => (
                    <li
                      key={avatar.id}
                      onClick={() => setSelectedAvatarId(avatar.id)}
                    >
                      <Image
                        src={avatar.url}
                        alt="Avatar"
                        height={60}
                        width={60}
                        className={`cursor-pointer rounded-full border-4 hover:border-primary duration-300 ease-out ${
                          selectedAvatarId === avatar.id
                            ? "border-primary"
                            : "border-transparent"
                        }`}
                      />
                    </li>
                  ))}
                </ul>
                {selectedAvatarId === "" && (
                  <p className="text-sm text-red-500">
                    Veuillez sélectionner un avatar
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  className="flex-1 cursor-pointer"
                >
                  Annuler
                </Button>
                <SubmitButton />
              </div>
            </form>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
