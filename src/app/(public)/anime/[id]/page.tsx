interface AnimeDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function AnimeDetailPage({ params }: AnimeDetailPageProps) {
  const { id } = await params;

  return (
    <div>
      <h1 className="text-3xl font-bold">Anime Detail</h1>
      <p className="text-zinc-500">Anime ID: {id}</p>
    </div>
  );
}