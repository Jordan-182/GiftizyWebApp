"use client";

import { getUserProfilesAction } from "@/actions/getUserProfiles.action";
import {
  updateWishlistAction,
  type UpdateWishlistState,
} from "@/actions/updateWishlist.action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import React, { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";

// Type pour les profils utilisateur (réutilise celui de createWishlistForm)
export type UserProfile = {
  id: string;
  name: string;
  isMainProfile: boolean;
  avatar: {
    url: string;
  } | null;
};

// Type pour les données de la wishlist à modifier
export type WishlistData = {
  id: string;
  name: string;
  description: string | null;
  profileId: string;
};

// Composant pour le formulaire qui utilise useFormStatus
function UpdateWishlistFormContent({
  formAction,
  state,
  profiles,
  wishlistData,
}: {
  formAction: (payload: FormData) => void;
  state: UpdateWishlistState;
  profiles: UserProfile[];
  wishlistData: WishlistData;
}) {
  const { pending } = useFormStatus();

  return (
    <form action={formAction} className="flex flex-col gap-4 w-full">
      <input type="hidden" name="id" value={wishlistData.id} />

      <div className="space-y-2">
        <Label htmlFor="name">
          Nom de la liste <span className="text-red-500">*</span>
        </Label>
        <Input
          id="name"
          name="name"
          type="text"
          required
          disabled={pending}
          defaultValue={wishlistData.name}
          placeholder="Ex: Ma liste de cadeaux"
        />
        {state.fieldErrors?.name && (
          <p className="text-sm text-red-500">{state.fieldErrors.name}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (optionnelle)</Label>
        <Input
          id="description"
          name="description"
          disabled={pending}
          defaultValue={wishlistData.description || ""}
          placeholder="Description de votre liste..."
        />
        {state.fieldErrors?.description && (
          <p className="text-sm text-red-500">
            {state.fieldErrors.description}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="profileId">
          Profil associé <span className="text-red-500">*</span>
        </Label>
        <Select
          name="profileId"
          required
          disabled={pending}
          defaultValue={wishlistData.profileId}
        >
          <SelectTrigger>
            <SelectValue placeholder="Choisir un profil" />
          </SelectTrigger>
          <SelectContent>
            {profiles.map((profile) => (
              <SelectItem key={profile.id} value={profile.id}>
                {profile.name}
                {profile.isMainProfile && " (Principal)"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {state.fieldErrors?.profileId && (
          <p className="text-sm text-red-500">{state.fieldErrors.profileId}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={pending || profiles.length === 0}
        className="w-full cursor-pointer mt-4"
      >
        {pending ? (
          <>
            <Spinner className="mr-2" />
            Modification...
          </>
        ) : (
          "Modifier la liste"
        )}
      </Button>
    </form>
  );
}

interface UpdateWishlistFormProps {
  onSuccess?: () => void;
  isOpen?: boolean;
  wishlistData: WishlistData;
}

export default function UpdateWishlistForm({
  onSuccess,
  isOpen = true,
  wishlistData,
}: UpdateWishlistFormProps) {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [profilesLoading, setProfilesLoading] = useState(true);
  const lastSuccessStateRef = React.useRef<UpdateWishlistState | null>(null);

  const initialState: UpdateWishlistState = { success: false };

  const [state, formAction] = useActionState(
    updateWishlistAction,
    initialState
  );

  // Charger les profils au montage du composant
  useEffect(() => {
    async function loadProfiles() {
      try {
        const userProfiles = await getUserProfilesAction();
        setProfiles(userProfiles);
      } catch {
        toast.error("Erreur lors du chargement des profils");
      } finally {
        setProfilesLoading(false);
      }
    }
    loadProfiles();
  }, []);

  // Réinitialiser la référence quand le dialog s'ouvre
  React.useEffect(() => {
    if (isOpen) {
      lastSuccessStateRef.current = null;
    }
  }, [isOpen]);

  // Gestion des effets de la server action avec protection contre les doublons
  React.useEffect(() => {
    // Vérifier si c'est un nouvel état de succès
    if (state.success && state !== lastSuccessStateRef.current) {
      toast.success("Liste modifiée avec succès !");
      lastSuccessStateRef.current = state;
      onSuccess?.();
    } else if (state.error && !state.success) {
      toast.error(state.error);
    }
  }, [state, onSuccess]);

  if (profilesLoading) {
    return (
      <div className="flex justify-center p-4">
        <Spinner />
      </div>
    );
  }

  if (profiles.length === 0) {
    return (
      <div className="text-center p-4">
        <p className="text-muted-foreground">
          Vous devez d&apos;abord créer un profil pour pouvoir modifier une
          liste.
        </p>
      </div>
    );
  }

  return (
    <UpdateWishlistFormContent
      formAction={formAction}
      state={state}
      profiles={profiles}
      wishlistData={wishlistData}
    />
  );
}
