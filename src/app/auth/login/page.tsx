import LoginForm from "@/components/loginForm";
import MagicLinkLoginForm from "@/components/magicLinkLoginForm";
import ReturnButton from "@/components/returnButton";
import SignInOAuthButton from "@/components/signInOAuthButton";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function LoginPage() {
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
        <h1 className="text-3xl font-bold">Connexion</h1>
        <div className="space-y-4">
          <MagicLinkLoginForm />
          <LoginForm />
          <p className="text-muted-foreground text-sm">
            Pas encore inscrit?{" "}
            <Link href="/auth/register" className="hover:text-foreground">
              Créer un compte
            </Link>
          </p>
          <hr className="max-w-sm" />
        </div>
        <div className="flex flex-col max-w-sm gap-4">
          <SignInOAuthButton provider="google" />
        </div>
      </div>
    </div>
  );
}
