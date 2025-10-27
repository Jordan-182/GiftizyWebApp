import { checkFriendshipStatusAction } from "@/actions/checkFriendshipStatus.action";
import { getUserByFriendCodeAction } from "@/actions/getUserByFriendCode.action";
import { getWishlistsByUserAction } from "@/actions/getWishlists.action";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function UserFriendPage({
  params,
}: {
  params: Promise<{ friendCode: string }>;
}) {
  const { friendCode } = await params;
  const retrievedUser = await getUserByFriendCodeAction(friendCode);
  const wishlists = await getWishlistsByUserAction(
    retrievedUser.data?.id || ""
  );
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/login");
  }

  if (!retrievedUser.success || !retrievedUser.data) {
    redirect("/friends");
  }

  const friendshipStatus = await checkFriendshipStatusAction(
    retrievedUser.data.id
  );

  if (!friendshipStatus.success || !friendshipStatus.data) {
    redirect("/friends");
  }

  const allowedStatuses = ["friend", "self"];
  if (!allowedStatuses.includes(friendshipStatus.data.status)) {
    redirect("/friends");
  }

  return (
    <>
      <h1>Hello, voici la page de {retrievedUser.data?.name}</h1>
      <Image
        src={retrievedUser.data.avatar?.url || "/logo.png"}
        alt={retrievedUser.data.name}
        height={80}
        width={80}
      />
      <h2>Listes</h2>
      <ul>
        {wishlists.map((list) => (
          <li key={list.id}>
            <Link href={`/wishlists/${list.id}`}>{list.name}</Link>
          </li>
        ))}
      </ul>
    </>
  );
}
