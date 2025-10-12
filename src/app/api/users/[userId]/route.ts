import { userService } from "@/services/userService";
import { NextRequest, NextResponse } from "next/server";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "Une erreur inconnue est survenue";
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  const { userId } = await context.params;
  try {
    const user = await userService.getUserById(userId);
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 404 }
    );
  }
}
