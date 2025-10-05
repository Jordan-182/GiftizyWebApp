import ReturnButton from "@/components/returnButton";

export default function VerifyEmailSuccessPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-8">
        <ReturnButton href="/auth/login" label="Connexion" />
        <h1 className="text-3xl font-bold">Envoyé!</h1>
      </div>
      <p className="text-muted-foreground">
        Un nouvel email de vérification a été envoyé à votre adresse email,
        pensez à vérifier vos courriers indésirables (spams).
      </p>
    </div>
  );
}
