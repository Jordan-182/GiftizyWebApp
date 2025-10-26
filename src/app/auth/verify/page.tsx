import ReturnButton from "@/components/returnButton";
import SendVerificationEmailForm from "@/components/sendVerificationEmailForm";
import { redirect } from "next/navigation";

interface VerifyEmailPageProps {
  searchParams: Promise<{ error: string }>;
}

export default async function VerifyEmailPage({
  searchParams,
}: VerifyEmailPageProps) {
  const error = (await searchParams).error;

  if (!error) redirect("/dashboard");

  return (
    <div className="space-y-8">
      <div className="space-y-8">
        <ReturnButton href="/auth/login" label="Connexion" />
        <h1 className="text-3xl font-bold">Vérification d&apos;email</h1>
      </div>
      <p className="text-destructive">
        {error === "invalid_token" || error === "token_expired"
          ? "Votre lien de vérification est invalide ou a expiré, veuillez en demander un nouveau."
          : error === "email_not_verified"
          ? "Veuillez vérifier votre adresse email ou demander un nouveau lien de vérification ci-dessous."
          : "Une erreur est survenue, veuillez réessayer."}
      </p>
      <SendVerificationEmailForm />
    </div>
  );
}
