import ReturnButton from "@/components/returnButton";

export default function ForgotPasswordSuccessPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-8">
        <ReturnButton href="/auth/login" label="Connexion" />
        <h1 className="text-3xl font-bold">Mail envoyé!</h1>
      </div>
      <p className="text-muted-foreground">
        Si votre adresse email correspond à un compte utilisateur, un lien de
        réinitialisation du mot de passe vous a été adressé.
      </p>
    </div>
  );
}
