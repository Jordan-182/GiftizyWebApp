import ChangePasswordForm from "@/components/changePasswordForm";
import SignOutButton from "@/components/signOutButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      <h1 className="text-3xl font-bold">Mon profil</h1>
      <Card>
        <CardContent className="flex gap-4 items-center flex-col sm:flex-row">
          <div className="max-w-3xs flex flex-col items-center gap-2">
            {session.user.image ? (
              <img
                src={session.user.image}
                alt="Avatar"
                className="size-40 border border-primary rounded-full object-cover"
                height={160}
                width={160}
              />
            ) : (
              <div className="size-24 border border-primary rounded-md bg-primary text-primary-foreground flex items-center justify-center">
                <span className="uppercase text-lg font-bold">
                  {session.user.name.slice(0, 2)}
                </span>
              </div>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold">{session.user.name}</h2>
            <p className="mb-4">{session.user.email}</p>
            <div className="flex justify-center gap-2 mb-2">
              {session.user.role === "ADMIN" && (
                <Button size="sm" className="w-46" asChild>
                  <Link href="/admin/dashboard">
                    Panneau d&apos;administration
                  </Link>
                </Button>
              )}
            </div>
            <SignOutButton />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Permissions</CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Modifier mon profil
          </CardTitle>
        </CardHeader>
        <CardContent>
          <UpdateUserForm
            name={session.user.name}
            image={session.user.image ?? ""}
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Modifier mot de passe
          </CardTitle>
        </CardHeader>
        <CardContent>
          {session.account?.providerId === "google" ? (
            <p>
              Votre compte a été créé grâce à la connexion avec Google, la
              modification de mot de passe est impossible.
            </p>
          ) : (
            <ChangePasswordForm />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
