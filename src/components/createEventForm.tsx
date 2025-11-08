"use client";

import {
  createEventAction,
  type CreateEventState,
} from "@/actions/events.action";
import { getUserProfilesAction } from "@/actions/getUserProfiles.action";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
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
      disabled={isPending}
      className="w-full cursor-pointer mt-4"
    >
      {isPending ? (
        <>
          <Spinner className="mr-2" />
          Création...
        </>
      ) : (
        "Créer l'événement"
      )}
    </Button>
  );
}

// Composant pour le contenu du formulaire
function CreateEventFormContent({
  formAction,
  state,
  profiles,
  isPending,
}: {
  formAction: (payload: FormData) => Promise<void>;
  state: CreateEventState;
  profiles: UserProfile[];
  isPending: boolean;
}) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string>("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formAction(formData);
  };

  // Obtenir la date et heure au format datetime-local pour l'input hidden
  const getDateTimeString = () => {
    if (!selectedDate || !selectedTime) return "";

    // Format YYYY-MM-DDTHH:MM directement sans conversion de fuseau horaire
    const year = selectedDate.getFullYear();
    const month = (selectedDate.getMonth() + 1).toString().padStart(2, "0");
    const day = selectedDate.getDate().toString().padStart(2, "0");

    return `${year}-${month}-${day}T${selectedTime}`;
  };

  // Obtenir l'heure actuelle au format HH:MM
  const getCurrentTime = () => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, "0")}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
      <div className="space-y-2">
        <Label htmlFor="name">
          Nom de l'événement <span className="text-red-500">*</span>
        </Label>
        <Input
          id="name"
          name="name"
          type="text"
          required
          placeholder="Ex: Anniversaire de Marie"
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
          placeholder="Description de votre événement..."
        />
        {state.fieldErrors?.description && (
          <p className="text-sm text-red-500">
            {state.fieldErrors.description}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="date">
          Date et heure <span className="text-red-500">*</span>
        </Label>
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="flex-1 justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate
                  ? format(selectedDate, "dd/MM/yyyy", { locale: fr })
                  : "Choisir une date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 z-999" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) =>
                  date < new Date(new Date().setHours(0, 0, 0, 0))
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Input
            type="time"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className="w-32"
            min={
              selectedDate &&
              selectedDate.toDateString() === new Date().toDateString()
                ? getCurrentTime()
                : undefined
            }
            required
          />
        </div>
        <input type="hidden" name="date" value={getDateTimeString()} required />
        {state.fieldErrors?.date && (
          <p className="text-sm text-red-500">{state.fieldErrors.date}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Lieu (optionnel)</Label>
        <Input
          id="location"
          name="location"
          type="text"
          placeholder="Ex: Chez Marie, Restaurant XYZ..."
        />
        {state.fieldErrors?.location && (
          <p className="text-sm text-red-500">{state.fieldErrors.location}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="profileId">Profil associé (optionnel)</Label>
        <Select name="profileId">
          <SelectTrigger>
            <SelectValue placeholder="Choisir un profil (optionnel)" />
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

interface CreateEventFormProps {
  onSuccess?: () => void;
  isOpen?: boolean; // Pour détecter quand le dialog s'ouvre/ferme
}

export default function CreateEventForm({
  onSuccess,
  isOpen = true,
}: CreateEventFormProps) {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [profilesLoading, setProfilesLoading] = useState(true);
  const [isPending, setIsPending] = useState(false);
  const [state, setState] = useState<CreateEventState>({ success: false });
  const lastSuccessStateRef = React.useRef<CreateEventState | null>(null);

  // Action wrapper qui gère directement l'appel
  const handleFormAction = async (formData: FormData) => {
    setIsPending(true);
    setState({ success: false }); // Reset state

    try {
      const result = await createEventAction({ success: false }, formData);
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
      toast.success("Événement créé avec succès !");
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

  return (
    <CreateEventFormContent
      formAction={handleFormAction}
      state={state}
      profiles={profiles}
      isPending={isPending}
    />
  );
}
