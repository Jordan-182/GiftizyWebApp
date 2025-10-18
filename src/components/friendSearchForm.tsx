"use client";

import type { Avatar, User } from "@/generated/prisma";
import { getUserByFriendCode } from "@/lib/api/users";
import Image from "next/image";
import { useState } from "react";
import AddFriendButton from "./addFriendButton";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "./ui/item";
import { Label } from "./ui/label";
import { Spinner } from "./ui/spinner";

type UserWithAvatar = User & {
  avatar: Avatar | null;
};

export default function FriendSearchForm() {
  const [isPending, setIsPending] = useState<boolean>(false);
  const [retrievedUser, setRetrievedUser] = useState<UserWithAvatar | null>(
    null
  );
  const [error, setError] = useState<string>("");
  const [addError, setAddError] = useState<string>("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);
    setError("");
    setAddError("");
    setRetrievedUser(null);
    const formData = new FormData(event.target as HTMLFormElement);
    const friendCode = String(formData.get("friendCode")).toUpperCase();
    if (friendCode.trim().length !== 6) {
      setError("Merci de renseigner un code ami valide de 6 caractères");
      setIsPending(false);
      return;
    }
    try {
      const response = await getUserByFriendCode(friendCode.trim());
      setRetrievedUser(response);
    } catch (error) {
      console.error("Erreur lors de la recherche d'ami:", error);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <section className="max-w-sm w-full space-y-4 mx-auto">
      {error && <p className="text-red-500">{error}</p>}
      {retrievedUser && (
        <Item className="flex mt-2" variant={"muted"}>
          <ItemContent className="flex flex-row gap-4">
            <ItemMedia className="w-fit">
              <Image
                src={retrievedUser.avatar?.url || "/default-avatar.png"}
                alt={`Avatar de ${retrievedUser.name}`}
                height={50}
                width={50}
              />
            </ItemMedia>
            <ItemTitle className="text-lg">{retrievedUser.name}</ItemTitle>
          </ItemContent>
          <ItemActions>
            <AddFriendButton
              friendId={retrievedUser.id}
              onError={(error: string) => setAddError(error)}
            />
          </ItemActions>
        </Item>
      )}
      {addError && <p className="text-red-500">{addError}</p>}
      <form onSubmit={handleSubmit} className="max-w-sm w-full space-y-4 ">
        <div className="space-y-2">
          <Label htmlFor="friendCode">Code ami :</Label>
          <Input
            type="text"
            id="friendCode"
            name="friendCode"
            placeholder="Entrez un code ami"
          />
        </div>
        <Button disabled={isPending} className="cursor-pointer w-36">
          {isPending ? <Spinner /> : "Rechercher"}
        </Button>
      </form>
    </section>
  );
}
