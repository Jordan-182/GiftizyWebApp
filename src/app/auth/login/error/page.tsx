import ReturnButton from "@/components/returnButton";

interface ErrorLoginPageProps {
  searchParams: Promise<{ error: string }>;
}

export default async function ErrorLoginPage({
  searchParams,
}: ErrorLoginPageProps) {
  const params = await searchParams;
  return (
    <div className="px-8 py-16 container mx-auto max-w-screen-lg space-y-8">
      <div className="space-y-8">
        <ReturnButton href="/auth/login" label="Homepage" />
        <h1 className="text-3xl font-bold">Erreur de connexion</h1>
      </div>
      <p className="text-destructive">
        {params.error === "account_not_linked"
          ? "Ce compte est déjà lié à une autre méthode de connexion"
          : "Une erreur est survenue, veuillez réessayer."}
      </p>
    </div>
  );
}
