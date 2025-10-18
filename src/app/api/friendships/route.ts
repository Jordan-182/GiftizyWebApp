import { auth } from "@/lib/auth";
import { friendService } from "@/services/friendService";
import { NextRequest, NextResponse } from "next/server";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "Une erreur inconnue est survenue";
}

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession(request);
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const userId = session.user.id;
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  try {
    let result;

    if (status === "accepted") {
      result = await friendService.getFriends(userId);
    } else if (status === "pending") {
      result = await friendService.getPendingFriendRequests(userId);
    } else {
      result = await friendService.getFriends(userId);
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession(request);
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const { friendId } = await request.json();
  const userId = session.user.id;

  if (!friendId) {
    return NextResponse.json({ error: "Code ami requis" }, { status: 400 });
  }

  try {
    const newFriendRequest = await friendService.createFriendRequest(
      userId,
      friendId
    );
    return NextResponse.json(newFriendRequest, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 400 }
    );
  }
}
