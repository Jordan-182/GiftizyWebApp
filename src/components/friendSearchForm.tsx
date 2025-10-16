"use client";

import { getUserByFriendCode } from "@/lib/api/users";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export default function FriendSearchForm() {
  const [isPending, setIsPending] = useState<boolean>(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);
    const formData = new FormData(event.target as HTMLFormElement);
    const friendCode = String(formData.get("friendCode"));
    const retrievedUser = getUserByFriendCode(friendCode);
    setIsPending(false);
    console.log(retrievedUser);
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-sm w-full space-y-4">
      <div className="space-y-2">
        <Label htmlFor="friendCode">Code ami :</Label>
        <Input
          type="text"
          id="friendCode"
          name="friendCode"
          placeholder="Entrez un code ami"
        />
      </div>
      <Button>Rechercher</Button>
    </form>
  );
}
