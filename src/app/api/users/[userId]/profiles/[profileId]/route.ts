import { profileService } from "@/services/profileService";
import { NextResponse } from "next/server";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "Une erreur inconnue est survenue";
}

export async function DELETE(
  request: Request,
  { params }: { params: { userId: string; profileId: string } }
) {
  try {
    await profileService.deleteProfileById(params.profileId);
    return new Response(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 404 }
    );
  }
}
