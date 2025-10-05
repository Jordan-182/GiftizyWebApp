import ResetPasswordForm from "@/components/resetPasswordForm";
import ReturnButton from "@/components/returnButton";
import { redirect } from "next/navigation";

interface ResetPasswordPageProps {
  searchParams: Promise<{ token: string }>;
}

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const token = (await searchParams).token;

  if (!token) redirect("/auth/login");

  return (
    <div className="space-y-8">
      <div className="space-y-8">
        <ReturnButton href="/auth/login" label="Connexion" />
        <h1 className="text-3xl font-bold">Réinitialisation de mot de passe</h1>
      </div>
      <p className="text-muted-foreground">
        Veuillez entrer un nouveau mot de passe. Assurez vous qu&apos;il
        contienne au minimum 8 caractères.
      </p>
      <ResetPasswordForm token={token} />
    </div>
  );
}
