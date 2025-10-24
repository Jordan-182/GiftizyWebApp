export async function getUserByFriendCode(friendCode: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/users/${friendCode}`,
    { method: "GET" }
  );
  if (!res.ok)
    throw new Error("Erreur lors de la récupération de l'utilisateur");
  return res.json();
}
