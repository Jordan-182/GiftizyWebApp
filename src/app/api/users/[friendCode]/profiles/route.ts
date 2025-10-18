import { auth } from "@/lib/auth";
import type { ProfileFormData } from "@/repositories/profileRepository";
import { profileService } from "@/services/profileService";
import { NextRequest, NextResponse } from "next/server";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "Une erreur inconnue est survenue";
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ friendCode: string }> }
) {
  const { friendCode } = await context.params;
  try {
    const profiles = await profileService.getProfilesByfriendCode(friendCode);
    return NextResponse.json(profiles, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 404 }
    );
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ friendCode: string }> }
) {
  const { friendCode } = await context.params;
  const session = await auth.api.getSession(request);
  if (!session || session.user.friendCode !== friendCode) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }
  try {
    const body = await request.json();
    const profileData = {
      ...body,
      birthDate: body.birthDate ? new Date(body.birthDate) : null,
    } as ProfileFormData;
    const newProfile = await profileService.createProfile(profileData);
    return NextResponse.json(newProfile, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 400 }
    );
  }
}
