export async function getUser(userId: string) {
  const res = await fetch(`/api/users/${userId}`, { method: "GET" });
  if (!res.ok)
    throw new Error("Erreur lors de la récupération de l'utilisateur");
  return res.json();
}
