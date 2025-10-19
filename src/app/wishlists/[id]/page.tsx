export default async function WishlistIdPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <div>Liste: {id}</div>;
}
