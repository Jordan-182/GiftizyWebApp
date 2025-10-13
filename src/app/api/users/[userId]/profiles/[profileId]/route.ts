import { auth } from "@/lib/auth";
import type { ProfileFormData } from "@/repositories/profileRepository";
import { profileService } from "@/services/profileService";
import { NextResponse } from "next/server";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "Une erreur inconnue est survenue";
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ userId: string; profileId: string }> }
) {
  const { userId, profileId } = await context.params;
  const session = await auth.api.getSession(request);
  if (!session || session.user.id !== userId) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  try {
    await profileService.deleteProfileById(profileId);
    return new Response(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 404 }
    );
  }
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ userId: string; profileId: string }> }
) {
  const { userId, profileId } = await context.params;
  const session = await auth.api.getSession(request);
  if (!session || session.user.id !== userId) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }
  try {
    const body = await request.json();
    const profileData = {
      ...body,
      birthDate: body.birthDate ? new Date(body.birthDate) : null,
    } as ProfileFormData;
    const updatedProfile = await profileService.editProfile(
      profileId,
      profileData
    );
    return NextResponse.json(updatedProfile, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 404 }
    );
  }
}
