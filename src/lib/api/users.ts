export async function getUser(id: string) {
  const res = await fetch(`/api/users/${id}`);
  if (!res.ok)
    throw new Error("Erreur lors de la récupération de l'utilisateur");
  return res.json();
}
