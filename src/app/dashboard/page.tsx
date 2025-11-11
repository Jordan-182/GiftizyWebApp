import DashboardAlerts from "@/components/dashboardAlerts";
import DashboardStats from "@/components/dashboardStats";
import MyReservations from "@/components/myReservations";
import { Skeleton } from "@/components/ui/skeleton";
import UpcomingEvents from "@/components/upcomingEvents";
import { Suspense } from "react";

// Force le rendu dynamique pour cette page car elle dépend de l'authentification
export const dynamic = "force-dynamic";

function AlertsSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-6 w-48" />
      <div className="grid gap-4 md:grid-cols-2">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    </div>
  );
}

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-24 w-full" />
    </div>
  );
}

function EventsSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-9 w-24" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    </div>
  );
}

function ReservationsSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-5 w-32" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-56 w-full" />
        <Skeleton className="h-56 w-full" />
        <Skeleton className="h-56 w-full" />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Section d'alertes pour les invitations en attente */}
      <Suspense fallback={<AlertsSkeleton />}>
        <DashboardAlerts />
      </Suspense>
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* Section des statistiques */}
      <Suspense fallback={<StatsSkeleton />}>
        <DashboardStats />
      </Suspense>

      {/* Section des événements à venir */}
      <Suspense fallback={<EventsSkeleton />}>
        <UpcomingEvents />
      </Suspense>

      {/* Section des réservations */}
      <Suspense fallback={<ReservationsSkeleton />}>
        <MyReservations />
      </Suspense>
    </div>
  );
}
