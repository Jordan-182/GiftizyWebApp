import { auth } from "@/lib/auth";
import { wishlistService } from "@/services/wishlistService";
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
  try {
    const wishlists = await wishlistService.getWishlistsByUser(userId);
    return NextResponse.json(wishlists, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 404 }
    );
  }
}
