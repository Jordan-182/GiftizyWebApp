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

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json(
      { error: "ID utilisateur manquant" },
      { status: 400 }
    );
  }

  try {
    const status = await friendService.checkFriendshipStatus(
      session.user.id,
      userId
    );
    return NextResponse.json(status, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}
