import type { Avatar, Profile } from "@/generated/prisma";
import Image from "next/image";
import Link from "next/link";
import CreateProfileModal from "./CreateProfileModal";
import DeleteProfileButton from "./deleteProfileButton";
import { Item, ItemActions, ItemContent, ItemTitle } from "./ui/item";
import UpdateProfileModal from "./updateProfileModal";

type ProfileWithAvatar = Profile & {
  avatar?: {
    url: string;
  } | null;
};

export default function ProfileSection({
  profiles,
  avatars,
  friendCode,
}: {
  profiles: ProfileWithAvatar[];
  avatars: Avatar[];
  friendCode: string;
}) {
  return (
    <>
      <ul className="flex flex-col gap-2">
        {profiles.length === 0 ? (
          <li className="text-center text-muted-foreground py-4">
            Aucun profil créé pour le moment
          </li>
        ) : (
          profiles.map((profile: ProfileWithAvatar) => (
            <li key={profile.id}>
              <Item variant={"muted"} className="flex justify-between">
                <Link
                  href={`/user/${profile.friendCode}/profiles/${profile.id}`}
                  className="flex gap-4 items-center"
                >
                  {profile.avatar?.url && (
                    <Image
                      src={profile.avatar?.url}
                      alt="Avatar du profil"
                      height={50}
                      width={50}
                    />
                  )}
                  <ItemContent className="gap-0">
                    <ItemTitle className="text-lg font-bold">
                      {profile.name}
                    </ItemTitle>
                    {profile.isMainProfile && <p>Profil principal</p>}
                  </ItemContent>
                </Link>
                <ItemActions className="h-[50px] py-2">
                  {profile.isMainProfile ? null : (
                    <DeleteProfileButton profileId={profile.id} />
                  )}
                  <UpdateProfileModal profile={profile} avatars={avatars} />
                </ItemActions>
              </Item>
            </li>
          ))
        )}
      </ul>
      <CreateProfileModal friendCode={friendCode} avatars={avatars} />
    </>
  );
}
