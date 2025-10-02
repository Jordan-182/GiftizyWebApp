import { userService } from "@/services/userService";
import { NextResponse } from "next/server";

type Params = {
  params: { id: string };
};

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "Une erreur inconnue est survenue";
}

export async function GET(_req: Request, { params }: Params) {
  try {
    const user = await userService.getUserById(params.id);
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 404 }
    );
  }
}
