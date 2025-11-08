import CreateEventButton from "@/components/CreateEventButton";
import FriendsEventsList from "@/components/friendsEventsList";
import MyEventsList from "@/components/myEventsList";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { auth } from "@/lib/auth";
import { Calendar, Users } from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function EventsPage() {
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
              <MyEventsList />
            </TabsContent>
            <TabsContent value="friends-events" className="mt-6">
              <FriendsEventsList />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
