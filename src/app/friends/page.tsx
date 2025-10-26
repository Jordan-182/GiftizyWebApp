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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FriendsProvider } from "@/contexts/FriendsContext";
import { auth } from "@/lib/auth";
import { friendService } from "@/services/friendService";
import { UserCheck, UserPlus } from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function FriendsPage() {
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
