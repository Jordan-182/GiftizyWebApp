export async function getFriends() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/friendships?status=accepted`,
    { method: "GET" }
  );
  if (!res.ok) throw new Error("Erreur lors de la récupération des amis");
  return res.json();
}

export async function getPendingFriendRequests() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/friendships?status=pending`,
    { method: "GET" }
  );
  if (!res.ok)
    throw new Error("Erreur lors de la récupération des demandes d'ami");
  return res.json();
}

export async function createFriendRequest(friendId: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/friendships`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ friendId }),
    }
  );
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Erreur lors de l'ajout d'amitié");
  }
  return res.json();
}

export async function deleteFriendship(friendshipId: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/friendships/${friendshipId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Erreur lors de la suppression");
  }
  return res.json();
}
