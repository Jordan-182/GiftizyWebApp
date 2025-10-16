import { ProfileFormData } from "@/repositories/profileRepository";

export async function getProfiles(friendCode: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/users/${friendCode}/profiles`,
    { method: "GET" }
  );
  if (!res.ok) throw new Error("Erreur lors de la récupération des profils");
  return res.json();
}

export async function deleteProfile(friendCode: string, profileId: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/users/${friendCode}/profiles/${profileId}`,
    { method: "DELETE" }
  );
  if (!res.ok) throw new Error("Erreur lors de la suppression du profil");
  return res;
}

export async function createProfile(
  friendCode: string,
  profileData: ProfileFormData
) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/users/${friendCode}/profiles`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profileData),
    }
  );
  if (!res.ok) throw new Error("Erreur lors de la création du profil");
  return res.json();
}

export async function editProfile(
  friendCode: string,
  profileId: string,
  updatedProfile: ProfileFormData
) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/users/${friendCode}/profiles/${profileId}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedProfile),
    }
  );
  if (!res.ok) throw new Error("Erreur lors de la modification du profil");
  return res.json();
}
