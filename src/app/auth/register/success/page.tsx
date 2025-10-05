import ReturnButton from "@/components/returnButton";

export default function RegisterSuccessPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-8">
        <ReturnButton href="/auth/login" label="Connexion" />
        <h1 className="text-3xl font-bold">Compte créé!</h1>
      </div>
      <p className="text-muted-foreground">
        Votre compte a été créé, veuilez surveiller votre boîte mail pour
        l&apos;email de vérification.
      </p>
    </div>
  );
}
