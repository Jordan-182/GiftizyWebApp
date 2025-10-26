"use client";

import {
  createWishlistAction,
  type CreateWishlistState,
} from "@/actions/createWishlist.action";
import { getUserProfilesAction } from "@/actions/getUserProfiles.action";
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

// Type pour les profils utilisateur
export type UserProfile = {
  id: string;
  name: string;
  isMainProfile: boolean;
  avatar: {
    url: string;
  } | null;
};

// Composant pour le formulaire qui utilise useFormStatus
function CreateWishlistFormContent({
  formAction,
  state,
  profiles,
}: {
  formAction: (payload: FormData) => void;
  state: CreateWishlistState;
  profiles: UserProfile[];
}) {
  const { pending } = useFormStatus();

  return (
    <form action={formAction} className="flex flex-col gap-4 w-full">
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
        <Select name="profileId" required disabled={pending}>
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
            Création...
          </>
        ) : (
          "Créer la liste"
        )}
      </Button>
    </form>
  );
}

interface CreateWishlistFormProps {
  onSuccess?: () => void;
}

export default function CreateWishlistForm({
  onSuccess,
}: CreateWishlistFormProps) {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [profilesLoading, setProfilesLoading] = useState(true);

  const initialState: CreateWishlistState = { success: false };

  const [state, formAction] = useActionState(
    createWishlistAction,
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

  // Gestion des effets de la server action
  React.useEffect(() => {
    if (state.success) {
      toast.success("Liste créée avec succès !");
      onSuccess?.();
    } else if (state.error) {
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
          Vous devez d&apos;abord créer un profil pour pouvoir créer une liste.
        </p>
      </div>
    );
  }

  return (
    <CreateWishlistFormContent
      formAction={formAction}
      state={state}
      profiles={profiles}
    />
  );
}
