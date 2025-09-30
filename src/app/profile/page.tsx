import SignOutButton from "@/components/signOutButton";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function ProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return <p className="text-destructive">Non autorisé</p>;
  }

  console.log(session);
  return (
    <div className="px-8 py-16 container mx-auto max-w-screen-lg space-y-8">
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Profil</h1>
        <h2>Bonjour {session.user.name}</h2>
        <SignOutButton />
      </div>
    </div>
  );
}
