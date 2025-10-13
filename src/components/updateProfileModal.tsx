"use client";

import type { Avatar, Profile } from "@/generated/prisma";
import { getAvatars } from "@/lib/api/avatars";
import { editProfile } from "@/lib/api/profiles";
import type { ProfileFormData } from "@/repositories/profileRepository";
import { format } from "date-fns";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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

export default function UpdateProfileModal({
  userId,
  profile,
}: {
  userId: string;
  profile: ProfileWithAvatar;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Partial<ProfileFormData>>({
    name: profile.name,
    birthDate: profile.birthDate
      ? format(new Date(profile.birthDate), "yyyy-MM-dd")
      : "",
    userId: profile.userId,
    avatarId: profile.avatarId || undefined,
    isMainProfile: profile.isMainProfile,
  });
  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const [selectedAvatarId, setSelectedAvatarId] = useState<string>(
    profile.avatarId || "cl2k5a8q00001x0u7d9a7p8z1"
  );
  // Récupération des avatars au montage
  useEffect(() => {
    async function fetchAvatars() {
      try {
        const data = await getAvatars();
        setAvatars(data);
      } catch (err) {
        console.log(err);
      }
    }
    fetchAvatars();
  }, []);
  const [birthDateState, setBirthDateState] = useState<Date | undefined>(
    profile.birthDate ? new Date(profile.birthDate) : undefined
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Format pour le champ caché
  const birthDateValueString = birthDateState
    ? format(birthDateState, "yyyy-MM-dd")
    : "";

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    // Validation des champs
    if (!form.name || form.name.trim().length < 2) {
      setError("Le nom du profil est requis");
      return;
    }
    if (!birthDateValueString) {
      setError("La date de naissance est requise");
      return;
    }
    if (!selectedAvatarId) {
      setError("Veuillez sélectionner un avatar");
      return;
    }
    setLoading(true);
    try {
      await editProfile(userId, profile.id, {
        name: form.name.trim(),
        birthDate: birthDateValueString,
        userId,
        avatarId: selectedAvatarId,
        isMainProfile: profile.isMainProfile,
      });
      setOpen(false);
      router.refresh();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Erreur inconnue");
      }
    } finally {
      setLoading(false);
    }
  };

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
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
              <Label htmlFor="name">Nom</Label>
              <Input
                name="name"
                placeholder="Nom du profil"
                value={form.name || ""}
                onChange={handleChange}
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
                {/* Champ caché pour le submit */}
                <input
                  type="hidden"
                  name="birthDate"
                  value={birthDateValueString}
                  required
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
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button
                type="submit"
                disabled={loading}
                className="cursor-pointer"
              >
                {loading ? <Spinner /> : "Mettre à jour"}
              </Button>
            </form>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
