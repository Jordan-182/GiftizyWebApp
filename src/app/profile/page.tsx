import ChangePasswordForm from "@/components/changePasswordForm";
import DeleteMyAccountButton from "@/components/deleteMyAccountButton";
import ProfileSection from "@/components/profileSection";
import SignOutButton from "@/components/signOutButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import UpdateAvatar from "@/components/UpdateAvatar";
import UpdateUserForm from "@/components/updateUserForm";
import { getAvatars } from "@/lib/api/avatars";
import { getProfiles } from "@/lib/api/profiles";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const headersList = await headers();
  const avatars = await getAvatars();

  const session = await auth.api.getSession({
    headers: headersList,
  });

  if (!session) {
    redirect("/auth/login");
  }
  const profiles = await getProfiles(session?.user.id);

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Mon compte</h1>
      <Card className="my-6">
        <CardContent className="flex gap-4 items-center flex-col sm:flex-row">
          <div className="max-w-3xs flex flex-col items-center gap-2">
            {session.user.avatarUrl ? (
              <Image
                src={session.user.avatarUrl}
                alt="Avatar"
                className="size-40 border-4 border-primary rounded-full object-cover flex-1"
                height={160}
                width={160}
              />
            ) : (
              <div className="size-40 border border-primary rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                <span className="uppercase text-4xl font-bold">
                  {session.user.name.slice(0, 2)}
                </span>
              </div>
            )}
          </div>
          <div className="w-full flex justify-between flex-col sm:flex-row">
            <div>
              <h2 className="text-2xl font-bold text-center sm:text-left">
                {session.user.name}
              </h2>
              <p className="mb-4 text-center sm:text-left">
                {session.user.email}
              </p>
              {session.user.birthDate && (
                <p className="mb-4 text-center sm:text-left">
                  Date de naissance :{" "}
                  {session.user.birthDate instanceof Date
                    ? session.user.birthDate.toLocaleDateString("fr-FR")
                    : session.user.birthDate}
                </p>
              )}
            </div>
            <div className="flex flex-col justify-center gap-2">
              {session.user.role === "ADMIN" && (
                <Button size="sm" asChild>
                  <Link href="/admin/dashboard">
                    Panneau d&apos;administration
                  </Link>
                </Button>
              )}
              <SignOutButton />
              <DeleteMyAccountButton userId={session.user.id} />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Mes profils</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 h-full">
            <ProfileSection profiles={profiles} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Modifier mon avatar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <UpdateAvatar avatars={avatars} avatarId={session.user.avatarId} />
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Modifier mes infos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <UpdateUserForm name={session.user.name} />
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
    </div>
  );
}
