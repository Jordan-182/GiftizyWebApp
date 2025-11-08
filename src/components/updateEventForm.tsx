"use client";

import {
  updateEventAction,
  type UpdateEventState,
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

// Type pour les données de l'événement à modifier
export type EventData = {
  id: string;
  name: string;
  description: string;
  date: string; // Format ISO pour l'input datetime-local
  location: string;
  profileId: string;
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
          Modification...
        </>
      ) : (
        "Modifier l'événement"
      )}
    </Button>
  );
}

// Composant pour le contenu du formulaire
function UpdateEventFormContent({
  formAction,
  state,
  profiles,
  eventData,
  isPending,
}: {
  formAction: (payload: FormData) => Promise<void>;
  state: UpdateEventState;
  profiles: UserProfile[];
  eventData: EventData;
  isPending: boolean;
}) {
  // Initialiser avec les données existantes en gérant le fuseau horaire
  const initializeDateTime = () => {
    if (!eventData.date) return { date: undefined, time: "" };

    const date = new Date(eventData.date);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return {
      date: date,
      time: `${hours}:${minutes}`,
    };
  };

  const { date: initialDate, time: initialTime } = initializeDateTime();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    initialDate
  );
  const [selectedTime, setSelectedTime] = useState<string>(initialTime);

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
      <input type="hidden" name="id" value={eventData.id} />

      <div className="space-y-2">
        <Label htmlFor="name">
          Nom de l'événement <span className="text-red-500">*</span>
        </Label>
        <Input
          id="name"
          name="name"
          type="text"
          required
          defaultValue={eventData.name}
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
          defaultValue={eventData.description || ""}
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
          defaultValue={eventData.location || ""}
          placeholder="Ex: Chez Marie, Restaurant XYZ..."
        />
        {state.fieldErrors?.location && (
          <p className="text-sm text-red-500">{state.fieldErrors.location}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="profileId">Profil associé (optionnel)</Label>
        <Select name="profileId" defaultValue={eventData.profileId || "none"}>
          <SelectTrigger>
            <SelectValue placeholder="Choisir un profil (optionnel)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Aucun profil</SelectItem>
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

interface UpdateEventFormProps {
  onSuccess?: () => void;
  isOpen?: boolean;
  eventData: EventData;
}

export default function UpdateEventForm({
  onSuccess,
  isOpen = true,
  eventData,
}: UpdateEventFormProps) {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [profilesLoading, setProfilesLoading] = useState(true);
  const [isPending, setIsPending] = useState(false);
  const [state, setState] = useState<UpdateEventState>({ success: false });
  const lastSuccessStateRef = React.useRef<UpdateEventState | null>(null);

  // Action wrapper qui gère directement l'appel
  const handleFormAction = async (formData: FormData) => {
    setIsPending(true);
    setState({ success: false }); // Reset state

    try {
      const result = await updateEventAction({ success: false }, formData);
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
      toast.success("Événement modifié avec succès !");
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
    <UpdateEventFormContent
      formAction={handleFormAction}
      state={state}
      profiles={profiles}
      eventData={eventData}
      isPending={isPending}
    />
  );
}
