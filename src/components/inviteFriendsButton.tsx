"use client";

import { inviteToEventAction } from "@/actions/events.action";
import { getFriendsAction } from "@/actions/getFriends.action";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Friend = {
  id: string;
  name: string;
  email: string;
  avatar: {
    url: string;
  } | null;
};

type Invitation = {
  friend: {
    id: string;
    name: string;
  };
  status: string;
};

interface InviteFriendsButtonProps {
  eventId: string;
  existingInvitations: Invitation[];
  currentUserId: string;
  className?: string;
}

export default function InviteFriendsButton({
  eventId,
  existingInvitations,
  currentUserId,
  className,
}: InviteFriendsButtonProps) {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Récupérer la liste des amis lors de l'ouverture du dialog
  useEffect(() => {
    if (isOpen) {
      loadFriends();
    }
  }, [isOpen]);

  const loadFriends = async () => {
    try {
      setIsLoading(true);
      const result = await getFriendsAction();

      if (result.success && result.data) {
        // Transformer les données des amis pour correspondre à notre type Friend
        const transformedFriends: Friend[] = result.data.map((friendship) => {
          // Déterminer quel ami nous concernons (celui qui n'est pas l'utilisateur actuel)
          const friend =
            friendship.sender.id === currentUserId
              ? friendship.receiver
              : friendship.sender;

          return {
            id: friend.id,
            name: friend.name,
            email: friend.friendCode, // Utiliser friendCode comme email temporairement
            avatar: friend.avatar,
          };
        });

        setFriends(transformedFriends);
      } else {
        setFriends([]);
        toast.error(result.error || "Erreur lors du chargement des amis");
      }
    } catch (error) {
      toast.error("Erreur lors du chargement des amis");
      console.error(error);
      setFriends([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrer les amis qui ne sont pas déjà invités
  const availableFriends = friends.filter(
    (friend) =>
      !existingInvitations.some(
        (invitation) => invitation.friend.id === friend.id
      )
  );

  const handleFriendToggle = (friendId: string) => {
    setSelectedFriends((prev) =>
      prev.includes(friendId)
        ? prev.filter((id) => id !== friendId)
        : [...prev, friendId]
    );
  };

  const handleSubmit = async () => {
    if (selectedFriends.length === 0) {
      toast.error("Veuillez sélectionner au moins un ami");
      return;
    }

    try {
      setIsSubmitting(true);

      // Envoyer les invitations une par une
      for (const friendId of selectedFriends) {
        const formData = new FormData();
        formData.append("eventId", eventId);
        formData.append("friendId", friendId);

        const result = await inviteToEventAction({ success: false }, formData);

        if (!result.success) {
          throw new Error(result.error || "Erreur lors de l'invitation");
        }
      }

      toast.success(
        `${selectedFriends.length} invitation${
          selectedFriends.length > 1 ? "s" : ""
        } envoyée${selectedFriends.length > 1 ? "s" : ""}`
      );

      // Réinitialiser et fermer
      setSelectedFriends([]);
      setIsOpen(false);

      // Recharger la page pour voir les nouvelles invitations
      window.location.reload();
    } catch (error) {
      toast.error("Erreur lors de l'envoi des invitations");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className={className} variant="outline">
          <UserPlus className="w-4 h-4 mr-2" />
          Inviter des amis
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Inviter des amis</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="ml-2">Chargement des amis...</span>
            </div>
          ) : availableFriends.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              {friends.length === 0
                ? "Vous n'avez pas encore d'amis"
                : "Tous vos amis ont déjà été invités"}
            </p>
          ) : (
            <>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {availableFriends.map((friend) => (
                  <div
                    key={friend.id}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50"
                  >
                    <Checkbox
                      id={friend.id}
                      checked={selectedFriends.includes(friend.id)}
                      onCheckedChange={() => handleFriendToggle(friend.id)}
                    />
                    <div className="flex items-center space-x-3 flex-1">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        {friend.avatar?.url ? (
                          <img
                            src={friend.avatar.url}
                            alt={friend.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-xs font-medium text-primary">
                            {friend.name.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{friend.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {friend.email}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  className="flex-1 cursor-pointer"
                  onClick={() => setIsOpen(false)}
                  disabled={isSubmitting}
                >
                  Annuler
                </Button>
                <Button
                  className="flex-1 cursor-pointer"
                  onClick={handleSubmit}
                  disabled={selectedFriends.length === 0 || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Envoi...
                    </>
                  ) : (
                    `Inviter (${selectedFriends.length})`
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
