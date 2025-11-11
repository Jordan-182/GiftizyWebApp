import { getDashboardStatsAction } from "@/actions/getDashboardStats.action";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Heart, Users } from "lucide-react";
import Link from "next/link";

export default async function DashboardStats() {
  const result = await getDashboardStatsAction();
  const stats = result.data;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Mes wishlists */}
      <Link href="/wishlists" className="group">
        <Card className="py-4 transition-all duration-200 group-hover:shadow-md group-hover:scale-105">
          <CardContent className="px-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Mes listes
                </p>
                <p className="text-2xl font-bold text-primary">
                  {stats.wishlistsCount}
                </p>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <Heart className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>

      {/* Mes amis */}
      <Link href="/friends" className="group">
        <Card className="py-4 transition-all duration-200 group-hover:shadow-md group-hover:scale-105">
          <CardContent className="px-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Mes amis
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.friendsCount}
                </p>
              </div>
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>

      {/* Événements à venir */}
      <Link href="/events" className="group">
        <Card className="py-4 transition-all duration-200 group-hover:shadow-md group-hover:scale-105">
          <CardContent className="px-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Événements à venir
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.eventsCount}
                </p>
              </div>
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full">
                <Calendar className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}
