export async function getAvatars() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/avatars`);
  if (!res.ok) throw new Error("Erreur lors de la récupération des avatars");
  return res.json();
}
