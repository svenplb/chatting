import { NextRequest, NextResponse } from "next/server";
import { db } from "~/server/db";
import { channels } from "~/server/db/schema";
import { eq } from "drizzle-orm";

// GET - Get channel by name
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name");

    if (!name) {
      return NextResponse.json({ error: "Channel name is required" }, { status: 400 });
    }

    const channel = await db
      .select()
      .from(channels)
      .where(eq(channels.name, name))
      .limit(1);

    if (channel.length === 0) {
      return NextResponse.json(null);
    }

    return NextResponse.json(channel[0]);
  } catch (error) {
    console.error("Error fetching channel:", error);
    return NextResponse.json({ error: "Failed to fetch channel" }, { status: 500 });
  }
} 