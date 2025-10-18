"use client";

import type { Avatar, Friendship } from "@/generated/prisma";
import { getFriends } from "@/lib/api/friends";
import { RotateCw } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "./ui/button";
import { Item, ItemContent, ItemMedia, ItemTitle } from "./ui/item";
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

interface FriendsListProps {
  initialData: FriendshipWithUsers[];
  userId: string;
}

export default function FriendsList({ initialData, userId }: FriendsListProps) {
  const [friends, setFriends] = useState<FriendshipWithUsers[]>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const refreshFriends = async () => {
    setIsLoading(true);
    setError("");
    try {
      const friendsData = await getFriends();
      setFriends(friendsData);
    } catch (error) {
      console.error("Erreur lors du rechargement des amis:", error);
      setError("Erreur lors du rechargement des amis");
    } finally {
      setIsLoading(false);
    }
  };

  const getFriendUser = (friendship: FriendshipWithUsers) => {
    return friendship.senderId === userId
      ? friendship.receiver
      : friendship.sender;
  };

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <section>
      <div className="flex items-center justify-between max-w-sm">
        <h2 className="text-xl font-bold">Liste d&apos;amis</h2>
        <Button
          onClick={refreshFriends}
          className="cursor-pointer"
          variant={"secondary"}
          size={"icon"}
        >
          {isLoading ? <Spinner /> : <RotateCw />}
        </Button>
      </div>
      <ul className="space-y-2">
        {friends.map((friendship) => {
          const friend = getFriendUser(friendship);
          return (
            <Item key={friendship.id} className="max-w-sm">
              <ItemContent>
                <ItemMedia>
                  <Image
                    src={friend.avatar?.url || "/logo.png"}
                    alt={friend.name}
                    height={50}
                    width={50}
                    className="rounded-full"
                  />
                </ItemMedia>
                <div>
                  <ItemTitle className="font-bold">{friend.name}</ItemTitle>
                  <p className="text-xs text-gray-500">
                    Code ami: {friend.friendCode}
                  </p>
                </div>
              </ItemContent>
            </Item>
          );
        })}
        {friends.length === 0 && (
          <p className="text-gray-500 text-center py-4 flex justify-center h-10">
            {isLoading ? <Spinner /> : "Aucun ami pour le moment"}
          </p>
        )}
      </ul>
    </section>
  );
}
