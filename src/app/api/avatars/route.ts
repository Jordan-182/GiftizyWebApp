import { avatarService } from "@/services/avatarService";
import { NextResponse } from "next/server";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "Une erreur inconnue est survenue";
}

export async function GET() {
  try {
    const avatars = await avatarService.getAll();
    return NextResponse.json(avatars, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 404 }
    );
  }
}
