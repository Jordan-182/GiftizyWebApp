import CreateWishlistButton from "@/components/CreateWishlistButton";
import FriendsWishlistsList from "@/components/friendsWishlistsList";
import MyWishlistsList from "@/components/myWishlistsList";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { auth } from "@/lib/auth";
import { Heart, List } from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function WishlistsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Mes listes</h1>{" "}
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
              <MyWishlistsList />
            </TabsContent>
            <TabsContent value="friends-lists" className="mt-6">
              <FriendsWishlistsList />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
