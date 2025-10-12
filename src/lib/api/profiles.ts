import { ProfileFormData } from "@/repositories/profileRepository";

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

export async function createProfile(
  userId: string,
  profileData: ProfileFormData
) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/users/${userId}/profiles`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profileData),
    }
  );
  if (!res.ok) throw new Error("Erreur lors de la création du profil");
  return res.json();
}
