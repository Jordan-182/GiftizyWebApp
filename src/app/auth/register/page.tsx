import RegisterForm from "@/components/registerForm";
import ReturnButton from "@/components/returnButton";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function RegisterPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/profile");
  }
  return (
    <div className="px-8 py-16 container mx-auto max-w-screen-lg space-y-8">
      <div className="space-y-8">
        <ReturnButton href="/" label="Homepage" />

        <h1 className="text-3xl font-bold">Inscription</h1>
        <RegisterForm />
        <p className="text-muted-foreground text-sm">
          Déjà inscrit?{" "}
          <Link href="/auth/login" className="hover:text-foreground">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
