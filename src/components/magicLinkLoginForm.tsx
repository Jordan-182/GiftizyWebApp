"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "@/lib/auth-client";
import { StarIcon } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

export default function MagicLinkLoginForm() {
  const [isPending, setIsPending] = useState(false);
  const ref = useRef<HTMLDetailsElement>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const email = String(formData.get("email"));

    if (!email) return toast.error("Veuillez entrer votre email");

    await signIn.magicLink({
      email,
      name: email.split("@")[0],
      callbackURL: "/profile",
      fetchOptions: {
        onRequest: () => {
          setIsPending(true);
        },
        onResponse: () => {
          setIsPending(false);
        },
        onError: (context) => {
          toast.error(context.error.message);
        },
        onSuccess: () => {
          toast.success("Surveillez votre boîte mail pour le Magic Link!");
          if (ref.current) ref.current.open = false;
          (event.target as HTMLFormElement).reset();
        },
      },
    });
  }

  return (
    <details
      ref={ref}
      className="max-w-sm rounded-md border border-purple-600 overflow-hidden"
    >
      <summary className="flex gap-2 items-center px-2 py-1  bg-purple-600 text-white hover:bg-purple-600/80 transition cursor-pointer">
        Essayer avec le Magic Link <StarIcon size={16} />
      </summary>
      <form onSubmit={handleSubmit} className="px-2 py-1">
        <Label htmlFor="email" className="sr-only">
          Email
        </Label>
        <div className="flex gap-2 items-center">
          <Input
            type="email"
            id="email"
            name="email"
            placeholder="Votre email"
          />
          <Button disabled={isPending}>Envoyer</Button>
        </div>
      </form>
    </details>
  );
}
