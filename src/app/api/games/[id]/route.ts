import { NextRequest, NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function DELETE(
  req: NextRequest,
  props: RouteParams
) {
  try {
    const { id } = await props.params;

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid or missing game ID parameter." },
        { status: 400 }
      );
    }

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

    const result = await db.collection("games").deleteOne({ _id: new ObjectId(id) });
    await client.close();

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Game listing not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Game deleted successfully!",
    });
  } catch (error: any) {
    console.error("DELETE game error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  props: RouteParams
) {
  try {
    const { id } = await props.params;

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid or missing game ID parameter." },
        { status: 400 }
      );
    }

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

    const result = await db.collection("games").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          title,
          description,
          genre,
          price: numericPrice,
          platforms: Array.isArray(platforms) ? platforms : [platforms],
          coverUrl,
          updatedAt: new Date(),
        },
      }
    );

    await client.close();

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Game listing not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Game updated successfully!",
    });
  } catch (error: any) {
    console.error("PUT game error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
