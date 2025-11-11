import FriendsRequestList from "@/components/friendRequestsList";
import FriendSearchForm from "@/components/friendSearchForm";
import FriendsList from "@/components/friendsList";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FriendsProvider } from "@/contexts/FriendsContext";
import { auth } from "@/lib/auth";
import { friendService } from "@/services/friendService";
import { UserCheck, UserPlus } from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";

// Force le rendu dynamique car cette page utilise l'authentification
export const dynamic = "force-dynamic";

function FriendsListSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-9 w-24" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-3 rounded-lg border"
          >
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-8 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}

function FriendRequestsSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-5 w-16" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-3 rounded-lg border border-blue-200 bg-blue-50"
          >
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-3 w-28" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TabsContentSkeleton() {
  return (
    <div className="mt-6 space-y-4">
      <Skeleton className="h-4 w-48" />
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-3 rounded-lg">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-8 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}

async function FriendsPageContent() {
  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList,
  });

  if (!session) {
    redirect("/auth/login");
  }

  const [initialRequests, initialFriends] = await Promise.all([
    friendService.getPendingFriendRequests(session.user.id),
    friendService.getFriends(session.user.id),
  ]);

  return (
    <FriendsProvider
      initialFriends={initialFriends}
      initialRequests={initialRequests}
    >
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Mes amis</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                className="cursor-pointer flex gap-0"
                aria-roledescription="Ajouter un ami"
              >
                <UserPlus className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[80vh] sm:max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full">
              <DialogHeader>
                <DialogTitle className="text-2xl">Ajouter un ami</DialogTitle>
              </DialogHeader>
              <div className="mt-4">
                <FriendSearchForm />
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="p-0">
          <CardContent className="p-4">
            <Tabs defaultValue="friends" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger
                  value="friends"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <UserCheck className="h-4 w-4" />
                  Amis
                </TabsTrigger>
                <TabsTrigger
                  value="requests"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <UserPlus className="h-4 w-4" />
                  Demandes
                </TabsTrigger>
              </TabsList>
              <TabsContent value="friends" className="mt-6">
                <FriendsList userId={session.user.id} />
              </TabsContent>
              <TabsContent value="requests" className="mt-6">
                <FriendsRequestList userId={session.user.id} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </FriendsProvider>
  );
}

function FriendsPageSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-10 w-10" />
      </div>

      <Card className="p-0">
        <CardContent className="p-4">
          <div className="space-y-6">
            <div className="flex w-full border-b border-border">
              <Skeleton className="h-10 w-24 mr-4" />
              <Skeleton className="h-10 w-28" />
            </div>
            <TabsContentSkeleton />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function FriendsPage() {
  return (
    <Suspense fallback={<FriendsPageSkeleton />}>
      <FriendsPageContent />
    </Suspense>
  );
}
