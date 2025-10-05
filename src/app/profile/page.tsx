import ChangePasswordForm from "@/components/changePasswordForm";
import SignOutButton from "@/components/signOutButton";
import { Button } from "@/components/ui/button";
import UpdateUserForm from "@/components/updateUserForm";
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
        <Button size="sm" className="cursor-pointer">
          Gérer mes wishlists
        </Button>
        <Button
          size="sm"
          className="cursor-pointer"
          disabled={!FULL_WISHLIST_ACCESS.success}
        >
          Gérer toutes les wishlists
        </Button>
      </div>

      {session.user.image ? (
        <img
          src={session.user.image}
          alt="Avatar"
          className="size-24 border border-primary rounded-md object-cover"
        />
      ) : (
        <div className="size-24 border border-primary rounded-md bg-primary text-primary-foreground flex items-center justify-center">
          <span className="uppercase text-lg font-bold">
            {session.user.name.slice(0, 2)}
          </span>
        </div>
      )}
      <div className="space-y-4 p-4 rounded-b-md border border-t-8 border-chart-5">
        <h2 className="text-2xl font-bold">Modifier mon profil</h2>
        <UpdateUserForm
          name={session.user.name}
          image={session.user.image ?? ""}
        />
      </div>
      <div className="space-y-4 p-4 rounded-b-md border border-t-8 border-chart-5">
        <h2 className="text-2xl font-bold">Modifier mot de passe</h2>
        {session.account?.providerId === "google" ? (
          <p>
            Votre compte a été créé grâce à la connexion avec Google, la
            modification de mot de passe est impossible.
          </p>
        ) : (
          <ChangePasswordForm />
        )}
      </div>
    </div>
  );
}
