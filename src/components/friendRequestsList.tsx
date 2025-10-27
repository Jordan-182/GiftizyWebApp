"use client";

import { deleteFriendshipAction } from "@/actions/deleteFriendship.action";
import { updateFriendRequestAction } from "@/actions/updateFriendRequest.action";
import { useFriends } from "@/contexts/FriendsContext";
import type { Avatar, Friendship } from "@/generated/prisma";
import { Check, RotateCw, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "./ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "./ui/item";
import { Spinner } from "./ui/spinner";

type UserWithAvatar = {
  id: string;
  name: string;
  friendCode: string;
  avatar: Avatar | null;
};

type FriendshipWithUsers = Friendship & {
  sender: UserWithAvatar;
  receiver: UserWithAvatar;
};

interface FriendsRequestListProps {
  userId: string;
}

export default function FriendsRequestList({
  userId,
}: FriendsRequestListProps) {
  const { friendRequests, isLoading, refreshAll } = useFriends();
  const [isCancelLoading, setIsCancelLoading] = useState(false);
  const [isAcceptLoading, setIsAcceptLoading] = useState(false);
  const [isRejectLoading, setIsRejectLoading] = useState(false);
  const [error] = useState<string>("");

  const categorizeRequests = (requests: FriendshipWithUsers[]) => {
    const receivedRequests = requests.filter(
      (request) => request.receiverId === userId
    );
    const sentRequests = requests.filter(
      (request) => request.senderId === userId
    );

    return { receivedRequests, sentRequests };
  };

  const { receivedRequests, sentRequests } = categorizeRequests(friendRequests);

  const handleAccept = (friendshipId: string) => {
    return async (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      setIsAcceptLoading(true);
      try {
        const result = await updateFriendRequestAction(friendshipId, true);
        if (result.success) {
          await refreshAll();
        }
      } catch (error) {
        console.error("Erreur lors de l'acceptation:", error);
      } finally {
        setIsAcceptLoading(false);
      }
    };
  };

  const handleReject = (friendshipId: string) => {
    return async (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      setIsRejectLoading(true);
      try {
        const result = await updateFriendRequestAction(friendshipId, false);
        if (result.success) {
          await refreshAll();
        }
      } catch (error) {
        console.error("Erreur lors du refus:", error);
      } finally {
        setIsRejectLoading(false);
      }
    };
  };

  const handleCancel = (friendshipId: string) => {
    return async (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      setIsCancelLoading(true);
      try {
        const result = await deleteFriendshipAction(friendshipId);
        if (result.success) {
          await refreshAll();
        }
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
      } finally {
        setIsCancelLoading(false);
      }
    };
  };

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <section>
      <div className="flex items-center justify-between w-full">
        <h2 className="text-xl font-bold">Demandes en attente</h2>
        <Button
          onClick={refreshAll}
          className="cursor-pointer"
          variant={"secondary"}
          size={"icon"}
        >
          {isLoading ? <Spinner /> : <RotateCw />}
        </Button>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-3">
          Demandes reçues ({receivedRequests.length})
        </h3>
        <ul className="flex gap-2 flex-wrap justify-center">
          {receivedRequests.map((request) => (
            <Item
              key={request.id}
              className="max-w-sm min-w-2xs"
              variant={"muted"}
            >
              <ItemContent>
                <div className="flex gap-4 items-center">
                  <ItemMedia>
                    <Image
                      src={request.sender.avatar?.url || "/logo.png"}
                      alt={request.sender.name}
                      height={50}
                      width={50}
                      className="rounded-full"
                    />
                  </ItemMedia>
                  <div>
                    <ItemTitle className="font-bold">
                      {request.sender.name}
                    </ItemTitle>
                    <p className="text-xs text-gray-500">
                      Demande reçue le{" "}
                      {new Date(request.createdAt).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                </div>
              </ItemContent>
              <ItemActions>
                <Button
                  size="sm"
                  variant="outline"
                  className="cursor-pointer"
                  onClick={handleAccept(request.id)}
                  disabled={isAcceptLoading}
                >
                  {isAcceptLoading ? <Spinner /> : <Check />}
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  className="cursor-pointer"
                  onClick={handleReject(request.id)}
                  disabled={isRejectLoading}
                >
                  {isRejectLoading ? <Spinner /> : <X />}
                </Button>
              </ItemActions>
            </Item>
          ))}
          {receivedRequests.length === 0 && (
            <p className="text-gray-500 text-center py-4 flex justify-center h-10">
              {isLoading ? <Spinner /> : "Aucune demande reçue en attente"}
            </p>
          )}
        </ul>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-3">
          Demandes envoyées ({sentRequests.length})
        </h3>
        <ul className="space-y-2 flex gap-2 flex-wrap justify-center">
          {sentRequests.map((request) => (
            <Item key={request.id} className="max-w-sm" variant="muted">
              <ItemContent>
                <div className="flex gap-4 items-center">
                  <ItemMedia>
                    <Image
                      src={request.receiver.avatar?.url || "/logo.png"}
                      alt={request.receiver.name}
                      height={50}
                      width={50}
                      className="rounded-full"
                    />
                  </ItemMedia>
                  <div>
                    <ItemTitle className="font-bold">
                      {request.receiver.name}
                    </ItemTitle>
                    <p className="text-xs text-gray-500">
                      Demande envoyée le{" "}
                      {new Date(request.createdAt).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                </div>
              </ItemContent>
              <ItemActions>
                <Button
                  size="sm"
                  variant="outline"
                  className="cursor-pointer"
                  onClick={handleCancel(request.id)}
                >
                  {isCancelLoading ? <Spinner /> : "Annuler"}
                </Button>
              </ItemActions>
            </Item>
          ))}
          {sentRequests.length === 0 && (
            <p className="text-gray-500 text-center py-4 flex justify-center h-12">
              {isLoading ? <Spinner /> : "Aucune demande envoyée en attente"}
            </p>
          )}
        </ul>
      </div>
    </section>
  );
}
