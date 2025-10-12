import type { Profile } from "@/generated/prisma";
import Image from "next/image";
import DeleteProfileButton from "./deleteProfileButton";
import { Button } from "./ui/button";
import { Item, ItemActions, ItemContent, ItemTitle } from "./ui/item";

type ProfileWithAvatar = Profile & {
  avatar?: {
    url: string;
  } | null;
};

export default function ProfileSection({
  profiles,
}: {
  profiles: ProfileWithAvatar[];
}) {
  return (
    <>
      <ul className="flex flex-col gap-2">
        {profiles.map((profile: ProfileWithAvatar) => (
          <li key={profile.id}>
            <Item variant={"muted"}>
              {profile.avatar?.url && (
                <Image
                  src={profile.avatar?.url}
                  alt="Avatar du profil"
                  height={50}
                  width={50}
                />
              )}
              <ItemContent>
                <ItemTitle className="text-lg font-bold">
                  {profile.name}
                </ItemTitle>
                {profile.birthDate && (
                  <p>
                    Date de naissance :{" "}
                    {profile.birthDate
                      ? new Date(profile.birthDate).toLocaleDateString("fr-FR")
                      : ""}
                  </p>
                )}
              </ItemContent>
              <ItemActions className="h-[50px] py-2">
                {profile.isMainProfile ? null : (
                  <DeleteProfileButton
                    userId={profile.userId}
                    profileId={profile.id}
                  />
                )}
                <Button
                  variant="default"
                  size="sm"
                  className="cursor-pointer h-full"
                >
                  Gérer
                </Button>
              </ItemActions>
            </Item>
          </li>
        ))}
      </ul>
      <Button className="mt-auto cursor-pointer">Créer un profil</Button>
    </>
  );
}
