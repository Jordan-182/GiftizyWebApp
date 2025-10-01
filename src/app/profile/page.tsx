import SignOutButton from "@/components/signOutButton";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const headersList = await headers();

  const session = await auth.api.getSession({
    headers: headersList,
  });

  if (!session) {
    redirect("/auth/login");
  }

  const FULL_WISHLIST_ACCESS = await auth.api.userHasPermission({
    headers: headersList,
    body: {
      permissions: {
        wishlists: ["update", "delete"],
      },
    },
  });

  return (
    <div className="px-8 py-16 container mx-auto max-w-screen-lg space-y-8">
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Profil</h1>
        <h2>Bonjour {session.user.name}</h2>
        <div className="flex items-center gap-2">
          {session.user.role === "ADMIN" && (
            <Button size="sm" asChild>
              <Link href="/admin/dashboard">Panneau d&apos;administration</Link>
            </Button>
          )}
          <SignOutButton />
        </div>
        <h3 className="text-2xl font-bold">Permissions</h3>
        <div className="space-x-4 space-y-4">
          <Button size="sm">Gérer mes wishlists</Button>
          <Button size="sm" disabled={!FULL_WISHLIST_ACCESS.success}>
            Gérer toutes les wishlists
          </Button>
        </div>
      </div>
    </div>
  );
}
