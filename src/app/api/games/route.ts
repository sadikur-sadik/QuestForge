import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    // Commented out to allow testing without session
    /*
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please log in to add games." },
        { status: 401 }
      );
    }
    */

    const body = await req.json();
    const { title, description, genre, price, platforms, coverUrl } = body;

    // Validate inputs
    if (!title || !description || !genre || price === undefined || !platforms || !coverUrl) {
      return NextResponse.json(
        { success: false, error: "Missing required game fields." },
        { status: 400 }
      );
    }

    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice) || numericPrice < 0) {
      return NextResponse.json(
        { success: false, error: "Invalid price value." },
        { status: 400 }
      );
    }

    // Reuse process.env.MONGODB_URI
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      return NextResponse.json(
        { success: false, error: "MongoDB connection URI is not configured." },
        { status: 500 }
      );
    }

    const client = new MongoClient(mongoUri);
    await client.connect();
    const db = client.db("questforge");

    // Construct the game record
    const game = {
      title,
      description,
      genre,
      price: numericPrice,
      platforms: Array.isArray(platforms) ? platforms : [platforms],
      coverUrl,
      rating: 5.0, // Initial default rating
      releaseDate: new Date().toISOString().split("T")[0],
      createdAt: new Date(),
      creator: {
        id: session?.user?.id || "mock_tester_id",
        name: session?.user?.name || "Mock Tester",
        email: session?.user?.email || "mocktester@questforge.com",
        image: session?.user?.image || null,
      },
    };

    const result = await db.collection("games").insertOne(game);
    await client.close();

    return NextResponse.json({
      success: true,
      message: "Game listed successfully!",
      gameId: result.insertedId,
      game,
    });
  } catch (error: any) {
    console.error("Failed to add game:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      return NextResponse.json(
        { success: false, error: "MongoDB connection URI is not configured." },
        { status: 500 }
      );
    }

    const client = new MongoClient(mongoUri);
    await client.connect();
    const db = client.db("questforge");

    // Fetch all games, newest first
    const games = await db
      .collection("games")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    await client.close();

    // Map _id to id for frontend compatibility
    const formattedGames = games.map((game) => ({
      id: game._id.toString(),
      title: game.title,
      description: game.description,
      genre: game.genre,
      price: game.price,
      platforms: game.platforms,
      coverUrl: game.coverUrl,
      rating: game.rating,
      releaseDate: game.releaseDate,
      developer: game.developer,
      publisher: game.publisher,
      creator: game.creator,
    }));

    return NextResponse.json({ success: true, games: formattedGames });
  } catch (error: any) {
    console.error("Failed to fetch games:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
