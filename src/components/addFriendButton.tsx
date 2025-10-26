"use client";

import { createFriendRequestAction } from "@/actions/createFriendRequest.action";
import { useFriends } from "@/contexts/FriendsContext";
import { UserRoundPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";

interface AddFriendButtonProps {
  friendId: string;
  onError?: (error: string) => void;
}

export default function AddFriendButton({
  friendId,
  onError,
}: AddFriendButtonProps) {
  const [isPending, setIsPending] = useState<boolean>(false);
  const { refreshAll } = useFriends();

  async function handleAddFriend(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    onError?.("");
    setIsPending(true);
    try {
      const result = await createFriendRequestAction(friendId);
      if (result.success) {
        toast.success("Demande d'ami envoyée!");
        await refreshAll();
      } else {
        const errorMessage = result.error || "Erreur lors de l'ajout en ami";
        onError?.(errorMessage);
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout d'ami:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Erreur lors de l'ajout en ami";
      onError?.(errorMessage);
    } finally {
      setIsPending(false);
    }
  }
  return (
    <Button
      variant={"outline"}
      size={"icon"}
      className="cursor-pointer"
      onClick={handleAddFriend}
    >
      {isPending ? <Spinner /> : <UserRoundPlus />}
    </Button>
  );
}
