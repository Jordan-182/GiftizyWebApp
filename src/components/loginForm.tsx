"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Spinner } from "./ui/spinner";

export default function LoginForm() {
  const [isPending, setIsPending] = useState<boolean>(false);

  const router = useRouter();
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);
    const email = String(formData.get("email"));
    const password = String(formData.get("password"));

    if (!email || !password) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    try {
      await signIn.email({
        email,
        password,
        callbackURL: "/profile",
        fetchOptions: {
          onRequest: () => {
            setIsPending(true);
          },
          onResponse: () => {
            setIsPending(false);
          },
          onError: (context) => {
            toast.error("Erreur de connexion: " + context.error.message);
            setIsPending(false);
          },
          onSuccess: () => {
            toast.success("Connexion réussie!");
            router.push("/profile");
          },
        },
      });
    } catch (error) {
      toast.error("Erreur de connexion");
      setIsPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-sm w-full space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input type="email" id="email" name="email" />
      </div>
      <div className="space-y-2">
        <div className="flex justify-between items-center gap-2">
          <Label htmlFor="password">Mot de passe</Label>
          <Link
            href="/auth/forgot-password"
            className="text-sm italic text-muted-foreground hover:text-foreground"
          >
            Mot de passe oublié
          </Link>
        </div>
        <Input type="password" id="password" name="password" />
      </div>
      <Button
        type="submit"
        className="w-full cursor-pointer"
        disabled={isPending}
      >
        {isPending ? <Spinner /> : "Connexion"}
      </Button>
    </form>
  );
}
