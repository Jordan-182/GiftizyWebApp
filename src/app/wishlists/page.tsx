import CreateWishlistButton from "@/components/CreateWishlistButton";
import FriendsWishlistsList from "@/components/friendsWishlistsList";
import MyWishlistsList from "@/components/myWishlistsList";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { auth } from "@/lib/auth";
import { Heart, List } from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";

// Force le rendu dynamique car cette page utilise l'authentification
export const dynamic = "force-dynamic";

function MyWishlistsSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-9 w-24" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="p-4 rounded-lg border space-y-3 h-44">
            <div className="flex items-start gap-3">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-4 rounded" />
                </div>
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-3/4" />
            </div>
            <div className="flex justify-between items-center mt-auto">
              <Skeleton className="h-6 w-20" />
              <div className="flex gap-1">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FriendsWishlistsSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-5 w-20" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="p-4 rounded-lg border space-y-3">
            <div className="flex items-start gap-3">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-2/3" />
            </div>
            <div className="flex justify-between items-center">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-8 w-16" />
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-4 rounded-lg border space-y-3">
            <div className="flex items-start gap-3">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-3/4" />
            </div>
            <Skeleton className="h-8 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}

async function WishlistsPageContent() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Mes listes</h1>
        <CreateWishlistButton />
      </div>

      <Card className="p-0">
        <CardContent className="p-4">
          <Tabs defaultValue="my-lists" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger
                value="my-lists"
                className="flex items-center gap-2 cursor-pointer"
              >
                <List className="h-4 w-4" />
                Mes listes
              </TabsTrigger>
              <TabsTrigger
                value="friends-lists"
                className="flex items-center gap-2 cursor-pointer"
              >
                <Heart className="h-4 w-4" />
                Listes des amis
              </TabsTrigger>
            </TabsList>
            <TabsContent value="my-lists" className="mt-6">
              <Suspense fallback={<MyWishlistsSkeleton />}>
                <MyWishlistsList />
              </Suspense>
            </TabsContent>
            <TabsContent value="friends-lists" className="mt-6">
              <Suspense fallback={<FriendsWishlistsSkeleton />}>
                <FriendsWishlistsList />
              </Suspense>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

function WishlistsPageSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-10 w-32" />
      </div>

      <Card className="p-0">
        <CardContent className="p-4">
          <div className="space-y-6">
            <div className="flex w-full border-b border-border">
              <Skeleton className="h-10 w-28 mr-4" />
              <Skeleton className="h-10 w-36" />
            </div>
            <TabsContentSkeleton />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function WishlistsPage() {
  return (
    <Suspense fallback={<WishlistsPageSkeleton />}>
      <WishlistsPageContent />
    </Suspense>
  );
}
