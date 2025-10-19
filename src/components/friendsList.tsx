"use client";

import { useFriends } from "@/contexts/FriendsContext";
import type { Avatar, Friendship } from "@/generated/prisma";
import { RotateCw } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import DeleteFriendButton from "./deleteFriendButton";
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

interface FriendsListProps {
  userId: string;
}

export default function FriendsList({ userId }: FriendsListProps) {
  const { friends, isLoading, refreshFriends } = useFriends();
  const [error] = useState<string>("");

  const getFriendUser = (friendship: FriendshipWithUsers) => {
    return friendship.senderId === userId
      ? friendship.receiver
      : friendship.sender;
  };

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <section>
      <div className="flex items-center justify-between w-full">
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
      <ul className="space-y-2 mt-4 flex gap-2 flex-wrap justify-center">
        {friends.map((friendship) => {
          const friend = getFriendUser(friendship);
          return (
            <li key={friendship.id}>
              <Item className="max-w-sm" variant={"muted"}>
                <ItemContent>
                  <div className="flex gap-4 items-center">
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
                  </div>
                </ItemContent>
                <ItemActions>
                  <DeleteFriendButton friendshipId={friendship.id} />
                </ItemActions>
              </Item>
            </li>
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
