"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUp } from "@/lib/auth-client";
import { toast } from "sonner";

export default function RegisterForm() {
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);

    const name = String(formData.get("name"));
    if (!name) return toast.error("Merci d'indiquer votre nom");

    const email = String(formData.get("email"));
    if (!email) return toast.error("Merci d'indiquer votre adresse email");

    const password = String(formData.get("password"));
    if (!password) return toast.error("Merci de renseigner un mot de passe");

    await signUp.email(
      {
        name,
        email,
        password,
      },
      {
        onRequest: () => {},
        onResponse: () => {},
        onError: (context) => {
          toast.error(context.error.message);
        },
        onSuccess: () => {},
      }
    );
  }
  return (
    <form onSubmit={handleSubmit} className="max-w-sm w-full space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nom</Label>
        <Input type="text" id="name" name="name" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input type="email" id="email" name="email" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Mot de passe</Label>
        <Input type="password" id="password" name="password" />
      </div>
      <Button type="submit" className="w-full cursor-pointer">
        Créer mon compte
      </Button>
    </form>
  );
}
