import { mutate } from "../mutation/api";

export async function addGames(data: {
  title: string;
  description: string;
  genre: string;
  price: number;
  platforms: string[];
  coverUrl: string;
  developer?: string;
  publisher?: string;
  creator: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  };
}) {
  return mutate("/games", data, "POST");
}
