"use client";

import type { Avatar } from "@/generated/prisma";
import { updateUser } from "@/lib/auth-client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";

type UpdateAvatarProps = {
  avatars: Avatar[];
  avatarId: string;
};

export default function UpdateAvatar({ avatars, avatarId }: UpdateAvatarProps) {
  const [isPending, setIsPending] = useState<boolean>(false);
  const [selectedAvatarId, setSelectedAvatarId] = useState<string>(avatarId);
  const router = useRouter();

  async function handleClick(avatarId: string) {
    setSelectedAvatarId(avatarId);
  }

  async function handleValidation() {
    if (!selectedAvatarId) return;
    await updateUser({
      avatarId: selectedAvatarId,
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
          router.refresh();
        },
      },
    });
  }

  return (
    <section className="flex flex-col gap-4 w-full space-y-4">
      <ul className="flex flex-wrap justify-center gap-2">
        {avatars.map((avatar) => {
          return (
            <li key={avatar.id} onClick={() => handleClick(avatar.id)}>
              <Image
                src={avatar.url}
                alt="Avatar"
                height={80}
                width={80}
                className={`cursor-pointer rounded-full border-4 hover:border-primary duration-300 ease-out ${
                  selectedAvatarId === avatar.id
                    ? "border-4 border-primary"
                    : ""
                }`}
              />
            </li>
          );
        })}
      </ul>
      <Button
        type="submit"
        disabled={isPending || !selectedAvatarId}
        className="cursor-pointer"
        onClick={handleValidation}
      >
        {!isPending ? <p>Mettre à jour</p> : <Spinner />}
      </Button>
    </section>
  );
}
