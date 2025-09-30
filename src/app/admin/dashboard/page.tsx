import DeleteUserButton, {
  PlaceholderDeleteUserButton,
} from "@/components/deleteUserButton";
import ReturnButton from "@/components/returnButton";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminDashboard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/auth/login");

  if (session.user.role !== "ADMIN") {
    return (
      <div className="px-8 py-16 container mx-auto max-w-screen-lg space-y-8">
        <div className="space-y-8">
          <ReturnButton href="/profile" label="Profil" />
          <h1 className="text-3xl font-bold">Panneau d&apos;administration</h1>
          <p className="p-2 rounded-md text-lg bg-red-700 text-white font-bold">
            ACCES INTERDIT
          </p>
        </div>
      </div>
    );
  }

  const users = await prisma.user.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return (
    <div className="px-8 py-16 container mx-auto max-w-screen-lg space-y-8">
      <div className="space-y-8">
        <ReturnButton href="/profile" label="Profil" />
        <h1 className="text-3xl font-bold">Panneau d&apos;administration</h1>
        <p>Bienvenue dans le panneau d&apos;admin, {session.user.name}</p>
      </div>
      <div className="w-hull overflow-x-auto">
        <table className="table-auto min-w-full whitespace-nowrap">
          <thead>
            <tr className="border-b text-sm text-left">
              <th className="px-2 py-2">ID</th>
              <th className="px-2 py-2">Nom</th>
              <th className="px-2 py-2">Email</th>
              <th className="px-2 py-2 text-center">Rôle</th>
              <th className="px-2 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b text-sm text-left">
                <td className="px-4 py-2">{user.id.slice(0, 8)}</td>
                <td className="px-4 py-2">{user.name}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2 text-center">{user.role}</td>
                <td className="px-4 py-2 text-center">
                  {user.role === "USER" ? (
                    <DeleteUserButton userId={user.id} />
                  ) : (
                    <PlaceholderDeleteUserButton />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
