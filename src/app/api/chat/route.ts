import { NextRequest, NextResponse } from "next/server";
import { db } from "~/server/db";
import { messages, users, channels } from "~/server/db/schema";
import { eq } from "drizzle-orm";

// GET - Retrieve messages for a channel
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const channelId = searchParams.get("channelId");

    if (!channelId) {
      return NextResponse.json({ error: "Channel ID is required" }, { status: 400 });
    }

    const channelMessages = await db
      .select({
        id: messages.id,
        content: messages.content,
        createdAt: messages.createdAt,
        user: {
          id: users.id,
          username: users.username,
          avatar: users.avatar,
          color: users.color,
        },
      })
      .from(messages)
      .innerJoin(users, eq(messages.userId, users.id))
      .where(eq(messages.channelId, parseInt(channelId)))
      .orderBy(messages.createdAt);

    return NextResponse.json(channelMessages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}

// POST - Save a new message
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, username, channelName, avatar, color } = body;

    if (!content || !username || !channelName) {
      return NextResponse.json(
        { error: "Content, username, and channelName are required" },
        { status: 400 }
      );
    }

    // Get or create user
    let user = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    let userId: number;
    if (user.length === 0) {
      const newUser = await db
        .insert(users)
        .values({
          username,
          avatar: avatar || "U",
          color: color || "text-blue-400",
        })
        .returning();
      userId = newUser[0].id;
    } else {
      userId = user[0].id;
    }

    // Get or create channel
    let channel = await db
      .select()
      .from(channels)
      .where(eq(channels.name, channelName))
      .limit(1);

    let channelId: number;
    if (channel.length === 0) {
      const newChannel = await db
        .insert(channels)
        .values({
          name: channelName,
          type: "text",
        })
        .returning();
      channelId = newChannel[0].id;
    } else {
      channelId = channel[0].id;
    }

    // Save the message
    const newMessage = await db
      .insert(messages)
      .values({
        content,
        userId,
        channelId,
      })
      .returning();

    return NextResponse.json(newMessage[0]);
  } catch (error) {
    console.error("Error saving message:", error);
    return NextResponse.json({ error: "Failed to save message" }, { status: 500 });
  }
} 