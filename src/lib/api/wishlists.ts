import { headers } from "next/headers";

export async function getMyWishlists() {
  const headersList = await headers();
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/wishlists`, {
    method: "GET",
    headers: {
      cookie: headersList.get("cookie") || "",
    },
  });
  if (!res.ok) throw new Error("Erreur lors de la récupération des listes");
  return res.json();
}

export async function getWishList(id: string) {
  const headersList = await headers();
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/wishlists/${id}`,
    {
      method: "GET",
      headers: {
        cookie: headersList.get("cookie") || "",
      },
    }
  );
  if (!res.ok) throw new Error("Erreur lors de la récupération de la liste");
  return res.json();
}
