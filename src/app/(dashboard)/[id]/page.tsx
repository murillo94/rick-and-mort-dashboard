import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

import { Avatar } from "@/ui/avatar";
import { Button } from "@/ui/button";
import { Typography } from "@/ui/typography";

import { getCharacter } from "@/data-access/services";

const getStatusBadgeColor = (status: string) => {
  const statusLower = status.toLowerCase();
  if (statusLower === "alive")
    return "bg-green-100 text-green-800 border-green-200";
  if (statusLower === "dead") return "bg-red-100 text-red-800 border-red-200";
  return "bg-gray-100 text-gray-800 border-gray-200";
};

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function CharacterPage({ params }: PageProps) {
  const { id } = await params;

  const { character } = await getCharacter({ id });

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto">
      <div>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/">
            <ArrowLeftIcon className="size-4" />
            Back
          </Link>
        </Button>
      </div>
      <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl shadow-lg overflow-hidden">
        <div className="flex flex-row items-start gap-6 p-8">
          <div className="flex-shrink-0">
            <Avatar src={character.image} alt={character.name} size="xl" />
          </div>
          <div className="flex-1 flex flex-col gap-4 text-center md:text-left">
            <div>
              <Typography variant="title">{character.name}</Typography>
              <div className="flex items-center gap-2 mt-2 justify-center md:justify-start">
                <span
                  className={`capitalize inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusBadgeColor(
                    character.status
                  )}`}
                >
                  <span
                    className={`w-2 h-2 rounded-full mr-2 ${
                      character.status.toLowerCase() === "alive"
                        ? "bg-green-600"
                        : character.status.toLowerCase() === "dead"
                        ? "bg-red-600"
                        : "bg-gray-600"
                    }`}
                  />
                  {character.status}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
              <div className="bg-white rounded-lg p-4">
                <Typography variant="caption">Species</Typography>
                <Typography variant="body" className="capitalize">
                  {character.species}
                </Typography>
              </div>
              <div className="bg-white rounded-lg p-4">
                <Typography variant="caption">Gender</Typography>
                <Typography variant="body" className="capitalize">
                  {character.gender}
                </Typography>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-primary-100 p-6 transition-shadow">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
              <span className="text-xl">📍</span>
            </div>
            <Typography variant="subtitle">Current Location</Typography>
          </div>
          <Typography variant="body" className="capitalize">
            {character.location.name}
          </Typography>
        </div>
        <div className="bg-white rounded-lg border border-primary-100 p-6 transition-shadow">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
              <span className="text-xl">🌍</span>
            </div>
            <Typography variant="subtitle">Origin</Typography>
          </div>
          <Typography variant="body" className="capitalize">
            {character.origin.name}
          </Typography>
        </div>
      </div>
      {character.episode.length > 0 && (
        <div className="bg-white rounded-lg border border-primary-100 p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
              <span className="text-xl">📺</span>
            </div>
            <Typography variant="subtitle">
              Episodes ({character.episode.length})
            </Typography>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto pr-2">
            {character.episode.map((episode) => (
              <div
                key={episode.id}
                className="bg-primary-50 rounded-lg p-4 hover:bg-primary-100 transition-colors border border-primary-100"
              >
                <Typography variant="caption" className="capitalize">
                  {episode.episode}
                </Typography>
                <Typography variant="small" className="capitalize">
                  {episode.name}
                </Typography>
                <Typography variant="small" className="capitalize">
                  {episode.air_date}
                </Typography>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
