export async function getProfiles(userId: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/users/${userId}/profiles`,
    { method: "GET" }
  );
  if (!res.ok) throw new Error("Erreur lors de la récupération des profils");
  return res.json();
}

export async function deleteProfile(userId: string, profileId: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/users/${userId}/profiles/${profileId}`,
    { method: "DELETE" }
  );
  if (!res.ok) throw new Error("Erreur lors de la suppression du profil");
  return res;
}
