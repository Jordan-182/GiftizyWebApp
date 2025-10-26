"use client";

import { getFriendsAction } from "@/actions/getFriends.action";
import { getPendingFriendRequestsAction } from "@/actions/getPendingFriendRequests.action";
import type { Avatar, Friendship } from "@/generated/prisma";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";

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

interface FriendsContextType {
  friends: FriendshipWithUsers[];
  friendRequests: FriendshipWithUsers[];
  isLoading: boolean;
  refreshFriends: () => Promise<void>;
  refreshFriendRequests: () => Promise<void>;
  refreshAll: () => Promise<void>;
  setFriends: (friends: FriendshipWithUsers[]) => void;
  setFriendRequests: (requests: FriendshipWithUsers[]) => void;
}

const FriendsContext = createContext<FriendsContextType | undefined>(undefined);

interface FriendsProviderProps {
  children: ReactNode;
  initialFriends: FriendshipWithUsers[];
  initialRequests: FriendshipWithUsers[];
}

export function FriendsProvider({
  children,
  initialFriends,
  initialRequests,
}: FriendsProviderProps) {
  const [friends, setFriends] = useState<FriendshipWithUsers[]>(initialFriends);
  const [friendRequests, setFriendRequests] =
    useState<FriendshipWithUsers[]>(initialRequests);
  const [isLoading, setIsLoading] = useState(false);

  const refreshFriends = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await getFriendsAction();
      if (result.success && result.data) {
        setFriends(result.data);
      }
    } catch (error) {
      console.error("Erreur lors du rechargement des amis:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshFriendRequests = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await getPendingFriendRequestsAction();
      if (result.success && result.data) {
        setFriendRequests(result.data);
      }
    } catch (error) {
      console.error("Erreur lors du rechargement des demandes:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshAll = useCallback(async () => {
    setIsLoading(true);
    try {
      const [friendsResult, requestsResult] = await Promise.all([
        getFriendsAction(),
        getPendingFriendRequestsAction(),
      ]);
      if (friendsResult.success && friendsResult.data) {
        setFriends(friendsResult.data);
      }
      if (requestsResult.success && requestsResult.data) {
        setFriendRequests(requestsResult.data);
      }
    } catch (error) {
      console.error("Erreur lors du rechargement:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value: FriendsContextType = {
    friends,
    friendRequests,
    isLoading,
    refreshFriends,
    refreshFriendRequests,
    refreshAll,
    setFriends,
    setFriendRequests,
  };

  return <FriendsContext value={value}>{children}</FriendsContext>;
}

export function useFriends() {
  const context = useContext(FriendsContext);
  if (context === undefined) {
    throw new Error("useFriends must be used within a FriendsProvider");
  }
  return context;
}
