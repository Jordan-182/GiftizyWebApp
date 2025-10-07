"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateUser } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Spinner } from "./ui/spinner";

interface UpdateUserFormProps {
  name: string;
  image: string;
}

export default function UpdateUserForm({ name, image }: UpdateUserFormProps) {
  const [isPending, setIsPending] = useState<boolean>(false);
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const name = String(formData.get("name"));
    const image = String(formData.get("image"));

    if (!name && !image) {
      return toast.error("Veuillez renseigner un nom et une image.");
    }

    await updateUser({
      ...(name && { name }),
      image,
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
        <Label htmlFor="image">Image</Label>
        <Input type="url" id="image" name="image" defaultValue={image} />
      </div>
      <Button type="submit" disabled={isPending} className="cursor-pointer">
        {!isPending ? <p>Mettre à jour</p> : <Spinner />}
      </Button>
    </form>
  );
}
