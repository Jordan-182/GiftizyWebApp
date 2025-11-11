import CreateEventButton from "@/components/CreateEventButton";
import EventInvitationsList from "@/components/eventInvitationsList";
import FriendsEventsList from "@/components/friendsEventsList";
import MyEventsList from "@/components/myEventsList";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { auth } from "@/lib/auth";
import { Calendar, Users } from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";

// Force le rendu dynamique car cette page utilise l'authentification
export const dynamic = "force-dynamic";

function EventInvitationsSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-5 w-12" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-4 rounded-lg border border-orange-200 bg-orange-50"
          >
            <Skeleton className="h-12 w-12 rounded-md" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-3 w-24" />
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

function MyEventsListSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-9 w-24" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="p-4 rounded-lg border space-y-3">
            <div className="flex items-start gap-3">
              <Skeleton className="h-12 w-12 rounded-md" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-40" />
              <Skeleton className="h-3 w-28" />
            </div>
            <div className="flex justify-between items-center">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-8 w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FriendsEventsListSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-36" />
        <Skeleton className="h-5 w-20" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-3 rounded-lg border"
          >
            <Skeleton className="h-12 w-12 rounded-md" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-3 w-32" />
            </div>
            <Skeleton className="h-8 w-16" />
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
          <div
            key={i}
            className="flex items-center gap-4 p-3 rounded-lg border"
          >
            <Skeleton className="h-12 w-12 rounded-md" />
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

async function EventsPageContent() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Evénements</h1>
        <CreateEventButton />
      </div>

      <Suspense fallback={<EventInvitationsSkeleton />}>
        <EventInvitationsList />
      </Suspense>

      <Card className="p-0">
        <CardContent className="p-4">
          <Tabs defaultValue="my-events" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger
                value="my-events"
                className="flex items-center gap-2 cursor-pointer"
              >
                <Calendar className="h-4 w-4" />
                Mes events
              </TabsTrigger>
              <TabsTrigger
                value="friends-events"
                className="flex items-center gap-2 cursor-pointer"
              >
                <Users className="h-4 w-4" />
                Events des amis
              </TabsTrigger>
            </TabsList>
            <TabsContent value="my-events" className="mt-6">
              <Suspense fallback={<MyEventsListSkeleton />}>
                <MyEventsList />
              </Suspense>
            </TabsContent>
            <TabsContent value="friends-events" className="mt-6">
              <Suspense fallback={<FriendsEventsListSkeleton />}>
                <FriendsEventsList />
              </Suspense>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

function EventsPageSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-10 w-32" />
      </div>

      <EventInvitationsSkeleton />

      <Card className="p-0">
        <CardContent className="p-4">
          <div className="space-y-6">
            <div className="flex w-full border-b border-border">
              <Skeleton className="h-10 w-28 mr-4" />
              <Skeleton className="h-10 w-32" />
            </div>
            <TabsContentSkeleton />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function EventsPage() {
  return (
    <Suspense fallback={<EventsPageSkeleton />}>
      <EventsPageContent />
    </Suspense>
  );
}
