import FriendSearchForm from "@/components/friendSearchForm";

export default function FriendssPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Mes amis</h1>
      <h2>Rechercher un ami</h2>
      <FriendSearchForm />
    </div>
  );
}
