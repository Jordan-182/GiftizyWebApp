import { userService } from "@/services/userService";
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
    const user = await userService.getUserByFriendCode(friendCode);
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 404 }
    );
  }
}
