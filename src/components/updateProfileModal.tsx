"use client";

import {
  updateProfileAction,
  type ProfileActionResult,
} from "@/actions/profiles.actions";
import type { Avatar, Profile } from "@/generated/prisma";
import { format } from "date-fns";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet";
import { Spinner } from "./ui/spinner";

type ProfileWithAvatar = Profile & {
  avatar?: {
    url: string;
  } | null;
};

function SubmitButton({ loading }: { loading: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending || loading}
      className="w-full cursor-pointer"
    >
      {pending || loading ? <Spinner /> : "Mettre à jour le profil"}
    </Button>
  );
}

export default function UpdateProfileModal({
  profile,
  avatars,
}: {
  profile: ProfileWithAvatar;
  avatars: Avatar[];
}) {
  const [open, setOpen] = useState(false);
  const [profileName, setProfileName] = useState(profile.name);
  const [selectedAvatarId, setSelectedAvatarId] = useState<string>(
    profile.avatarId || "cl2k5a8q00001x0u7d9a7p8z1"
  );
  const [birthDateState, setBirthDateState] = useState<Date | undefined>(
    profile.birthDate ? new Date(profile.birthDate) : undefined
  );
  const router = useRouter();

  // Server Action avec useActionState
  const updateProfileWithId = updateProfileAction.bind(null, profile.id);
  const [state, formAction] = useActionState<ProfileActionResult, FormData>(
    updateProfileWithId,
    { success: false }
  );

  // Gestion des effets de bord de l'action
  useEffect(() => {
    if (state.success) {
      toast.success("Le profil a été mis à jour avec succès");
      setOpen(false);
      router.refresh();
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state.success, state.error, router]);

  // Reset des états locaux quand le modal se ferme
  useEffect(() => {
    if (!open) {
      setProfileName(profile.name);
      setSelectedAvatarId(profile.avatarId || "cl2k5a8q00001x0u7d9a7p8z1");
      setBirthDateState(
        profile.birthDate ? new Date(profile.birthDate) : undefined
      );
    }
  }, [open, profile.name, profile.avatarId, profile.birthDate]);

  // Format pour le champ caché
  const birthDateValueString = birthDateState
    ? format(birthDateState, "yyyy-MM-dd")
    : "";

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="rounded-sm cursor-pointer"
        size="sm"
        variant={"outline"}
      >
        Gérer
      </Button>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="bottom"
          className="h-[calc(100dvh-82px)] p-8 flex flex-col justify-center"
        >
          <div className="max-w-120 mx-auto">
            <SheetHeader className="p-0">
              <SheetTitle className="text-2xl">Modifier le profil</SheetTitle>
            </SheetHeader>
            <form action={formAction} className="flex flex-col gap-4 mt-4">
              <Label htmlFor="name">Nom</Label>
              <Input
                name="name"
                placeholder="Nom du profil"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                required
              />
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
                {/* Champs cachés pour le submit */}
                <input
                  type="hidden"
                  name="birthDate"
                  value={birthDateValueString}
                  required
                />
                <input type="hidden" name="avatarId" value={selectedAvatarId} />
                <input
                  type="hidden"
                  name="isMainProfile"
                  value={profile.isMainProfile.toString()}
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
              {state.fieldErrors && (
                <div className="text-red-500 text-sm">
                  {Object.entries(state.fieldErrors).map(([field, errors]) => (
                    <p key={field}>{errors}</p>
                  ))}
                </div>
              )}
              <SubmitButton loading={false} />
            </form>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
