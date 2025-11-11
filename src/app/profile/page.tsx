import { getAvatarsAction } from "@/actions/getAvatars.action";
import { getMyProfilesAction } from "@/actions/profiles.actions";
import ChangePasswordForm from "@/components/changePasswordForm";
import DeleteMyAccountButton from "@/components/deleteMyAccountButton";
import FriendCode from "@/components/friendCode";
import ProfileSection from "@/components/profileSection";
import SignOutButton from "@/components/signOutButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import UpdateAvatar from "@/components/UpdateAvatar";
import UpdateUserForm from "@/components/updateUserForm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

function ProfileHeaderSkeleton() {
  return (
    <Card className="my-6">
      <CardContent className="flex gap-4 items-center flex-col sm:flex-row">
        <div className="max-w-3xs flex flex-col items-center gap-2">
          <Skeleton className="size-40 rounded-full" />
        </div>
        <div className="w-full flex justify-between flex-col sm:flex-row">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-8 w-48 mb-3" />
            <Skeleton className="h-4 w-64 mb-1" />
            <Skeleton className="h-4 w-40 mb-1" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="flex flex-col justify-center gap-2">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-32" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ProfileSectionSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Mes profils</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 h-full">
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 rounded-lg border"
            >
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-8 w-16" />
            </div>
          ))}
        </div>
        <Skeleton className="h-10 w-full mt-4" />
      </CardContent>
    </Card>
  );
}

function UpdateAvatarSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Modifier mon avatar
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-full" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function ProfilePageSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-9 w-40" />
      <ProfileHeaderSkeleton />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ProfileSectionSkeleton />
        <UpdateAvatarSkeleton />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Modifier mes infos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-full" />
              </div>
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Modifier mot de passe
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-10 w-full" />
              </div>
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

async function ProfilePageContent() {
  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList,
  });

  if (!session) {
    redirect("/auth/login");
  }

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
            <div className="flex flex-col gap-0">
              <h2 className="mb-3 text-2xl font-bold text-center sm:text-left">
                {session.user.name}
              </h2>
              <p className="mb-1 text-center sm:text-left">
                {session.user.email}
              </p>
              {session.user.birthDate && (
                <p className="mb-1 text-center sm:text-left">
                  Date de naissance :{" "}
                  {session.user.birthDate instanceof Date
                    ? session.user.birthDate.toLocaleDateString("fr-FR")
                    : session.user.birthDate}
                </p>
              )}
              <FriendCode friendCode={session.user.friendCode} />
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
        <Suspense fallback={<ProfileSectionSkeleton />}>
          <ProfileSectionWithData friendCode={session.user.friendCode} />
        </Suspense>
        <Suspense fallback={<UpdateAvatarSkeleton />}>
          <UpdateAvatarWithData avatarId={session.user.avatarId} />
        </Suspense>
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

async function ProfileSectionWithData({ friendCode }: { friendCode: string }) {
  const profiles = await getMyProfilesAction();
  const avatars = await getAvatarsAction();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Mes profils</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 h-full">
        <ProfileSection
          profiles={profiles}
          avatars={avatars}
          friendCode={friendCode}
        />
      </CardContent>
    </Card>
  );
}

async function UpdateAvatarWithData({
  avatarId,
}: {
  avatarId: string | null | undefined;
}) {
  const avatars = await getAvatarsAction();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Modifier mon avatar
        </CardTitle>
      </CardHeader>
      <CardContent>
        <UpdateAvatar avatars={avatars} avatarId={avatarId || ""} />
      </CardContent>
    </Card>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<ProfilePageSkeleton />}>
      <ProfilePageContent />
    </Suspense>
  );
}
