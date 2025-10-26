"use client";

import { checkFriendshipStatusAction } from "@/actions/checkFriendshipStatus.action";
import { deleteFriendshipAction } from "@/actions/deleteFriendship.action";
import { getUserByFriendCodeAction } from "@/actions/getUserByFriendCode.action";
import { updateFriendRequestAction } from "@/actions/updateFriendRequest.action";
import { useFriends } from "@/contexts/FriendsContext";
import type { Avatar, User } from "@/generated/prisma";
import { Check, Clock, UserCheck, UserRoundPlus, UserX } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import AddFriendButton from "./addFriendButton";
import DeleteFriendButton from "./deleteFriendButton";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { friendshipBadgeVariants } from "./ui/friendship-badge";
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

type FriendshipStatus = {
  status: "self" | "none" | "friend" | "pending_sent" | "pending_received";
  friendshipId?: string;
};

export default function FriendSearchForm() {
  const [isPending, setIsPending] = useState<boolean>(false);
  const [retrievedUser, setRetrievedUser] = useState<UserWithAvatar | null>(
    null
  );
  const [friendshipStatus, setFriendshipStatus] =
    useState<FriendshipStatus | null>(null);
  const [error, setError] = useState<string>("");
  const [addError, setAddError] = useState<string>("");
  const { refreshAll } = useFriends();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);
    setError("");
    setAddError("");
    setRetrievedUser(null);
    setFriendshipStatus(null);
    const formData = new FormData(event.target as HTMLFormElement);
    const friendCode = String(formData.get("friendCode")).toUpperCase();
    if (friendCode.trim().length !== 6) {
      setError("Merci de renseigner un code ami valide de 6 caractères");
      setIsPending(false);
      return;
    }
    try {
      const result = await getUserByFriendCodeAction(friendCode.trim());

      if (!result.success || !result.data) {
        setError(result.error || "Utilisateur non trouvé");
        return;
      }

      setRetrievedUser(result.data);
      const statusResult = await checkFriendshipStatusAction(result.data.id);
      if (statusResult.success && statusResult.data) {
        setFriendshipStatus(statusResult.data as FriendshipStatus);
      }
    } catch (error) {
      console.error("Erreur lors de la recherche d'ami:", error);
      setError("Utilisateur non trouvé ou erreur de connexion");
    } finally {
      setIsPending(false);
    }
  }

  const renderUserActions = () => {
    if (!friendshipStatus) return null;

    switch (friendshipStatus.status) {
      case "self":
        return (
          <Badge className={friendshipBadgeVariants({ status: "self" })}>
            <UserCheck className="h-4 w-4" />
            C&apos;est vous !
          </Badge>
        );

      case "friend":
        return (
          <div className="flex flex-col items-center gap-2">
            <Badge className={friendshipBadgeVariants({ status: "friend" })}>
              <UserCheck className="h-4 w-4" />
              Déjà ami
            </Badge>
            {friendshipStatus.friendshipId && (
              <DeleteFriendButton
                friendshipId={friendshipStatus.friendshipId}
              />
            )}
          </div>
        );

      case "pending_sent":
        return (
          <div className="flex flex-col items-center gap-2">
            <Badge
              className={friendshipBadgeVariants({ status: "pending_sent" })}
            >
              <Clock className="h-4 w-4" />
              Demande envoyée
            </Badge>
            {friendshipStatus.friendshipId && (
              <Button
                size="sm"
                variant="outline"
                onClick={async () => {
                  try {
                    const result = await deleteFriendshipAction(
                      friendshipStatus.friendshipId!
                    );
                    if (result.success) {
                      await refreshAll();
                      setFriendshipStatus({ status: "none" });
                    }
                  } catch (error) {
                    console.error("Erreur lors de l'annulation:", error);
                  }
                }}
              >
                Annuler
              </Button>
            )}
          </div>
        );

      case "pending_received":
        return (
          <div className="flex flex-col items-center gap-2">
            <Badge
              className={friendshipBadgeVariants({
                status: "pending_received",
              })}
            >
              <UserRoundPlus className="h-4 w-4" />
              Demande reçue
            </Badge>
            {friendshipStatus.friendshipId && (
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={async () => {
                    try {
                      const result = await updateFriendRequestAction(
                        friendshipStatus.friendshipId!,
                        true
                      );
                      if (result.success) {
                        await refreshAll();
                        setFriendshipStatus({
                          status: "friend",
                          friendshipId: friendshipStatus.friendshipId,
                        });
                      }
                    } catch (error) {
                      console.error("Erreur lors de l'acceptation:", error);
                    }
                  }}
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={async () => {
                    try {
                      const result = await updateFriendRequestAction(
                        friendshipStatus.friendshipId!,
                        false
                      );
                      if (result.success) {
                        await refreshAll();
                        setFriendshipStatus({ status: "none" });
                      }
                    } catch (error) {
                      console.error("Erreur lors du refus:", error);
                    }
                  }}
                >
                  <UserX className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        );

      case "none":
        return (
          <AddFriendButton
            friendId={retrievedUser!.id}
            onError={(error: string) => setAddError(error)}
          />
        );

      default:
        return null;
    }
  };

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
                className="rounded-full"
              />
            </ItemMedia>
            <ItemTitle className="text-lg">{retrievedUser.name}</ItemTitle>
          </ItemContent>
          <ItemActions>{renderUserActions()}</ItemActions>
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
