import ReturnButton from "@/components/returnButton";

export default function ForgotPasswordSuccessPage() {
  return (
    <div className="px-8 py-16 container mx-auto max-w-screen-lg space-y-8">
      <div className="space-y-8">
        <ReturnButton href="/auth/login" label="Homepage" />
        <h1 className="text-3xl font-bold">Mail envoyé!</h1>
      </div>
      <p className="text-muted-foreground">
        Un lien de réinitialisation de mot de passe vous a été envoyé par email.
      </p>
    </div>
  );
}
