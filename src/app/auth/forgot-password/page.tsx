import ForgotPasswordForm from "@/components/forgotPasswordForm";
import ReturnButton from "@/components/returnButton";

export default function ForgotPasswordPage() {
  return (
    <div className="px-8 py-16 container mx-auto max-w-screen-lg space-y-8">
      <div className="space-y-8">
        <ReturnButton href="/auth/login" label="Homepage" />
        <h1 className="text-3xl font-bold">Mot de passe oublié</h1>
      </div>
      <p className="text-muted-foreground">
        Veuillez indiquer votre adresse email pour recevoir un lien de
        réinitialisation de mot de passe.
      </p>
      <ForgotPasswordForm />
    </div>
  );
}
