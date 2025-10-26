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
import React, { useEffect, useState } from "react";
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

// Composant pour le bouton de soumission
function SubmitButton({
  profiles,
  isPending,
}: {
  profiles: UserProfile[];
  isPending: boolean;
}) {
  return (
    <Button
      type="submit"
      disabled={isPending || profiles.length === 0}
      className="w-full cursor-pointer mt-4"
    >
      {isPending ? (
        <>
          <Spinner className="mr-2" />
          Création...
        </>
      ) : (
        "Créer la liste"
      )}
    </Button>
  );
}

// Composant pour le contenu du formulaire
function CreateWishlistFormContent({
  formAction,
  state,
  profiles,
  isPending,
}: {
  formAction: (payload: FormData) => Promise<void>;
  state: CreateWishlistState;
  profiles: UserProfile[];
  isPending: boolean;
}) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formAction(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
      <div className="space-y-2">
        <Label htmlFor="name">
          Nom de la liste <span className="text-red-500">*</span>
        </Label>
        <Input
          id="name"
          name="name"
          type="text"
          required
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
        <Select name="profileId" required>
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

      <SubmitButton profiles={profiles} isPending={isPending} />
    </form>
  );
}

interface CreateWishlistFormProps {
  onSuccess?: () => void;
  isOpen?: boolean; // Pour détecter quand le dialog s'ouvre/ferme
}

export default function CreateWishlistForm({
  onSuccess,
  isOpen = true,
}: CreateWishlistFormProps) {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [profilesLoading, setProfilesLoading] = useState(true);
  const [isPending, setIsPending] = useState(false);
  const [state, setState] = useState<CreateWishlistState>({ success: false });
  const lastSuccessStateRef = React.useRef<CreateWishlistState | null>(null);

  // Action wrapper qui gère directement l'appel
  const handleFormAction = async (formData: FormData) => {
    setIsPending(true);
    setState({ success: false }); // Reset state

    try {
      const result = await createWishlistAction({ success: false }, formData);
      setState(result);
    } catch (error) {
      setState({
        success: false,
        error:
          error instanceof Error ? error.message : "Une erreur est survenue",
      });
    } finally {
      setIsPending(false);
    }
  };

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
      toast.success("Liste créée avec succès !");
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
          Vous devez d&apos;abord créer un profil pour pouvoir créer une liste.
        </p>
      </div>
    );
  }

  return (
    <CreateWishlistFormContent
      formAction={handleFormAction}
      state={state}
      profiles={profiles}
      isPending={isPending}
    />
  );
}
