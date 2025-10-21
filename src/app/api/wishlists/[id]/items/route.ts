import { auth } from "@/lib/auth";
import { CreateWishlistItemSchema } from "@/schemas";
import { wishlistItemService } from "@/services/wishlistItemService";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "Une erreur inconnue est survenue";
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const session = await auth.api.getSession(request);

  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  try {
    const body = await request.json();

    // Validation avec Zod
    const validatedData = CreateWishlistItemSchema.parse(body);

    // Appel du service avec l'userId pour vérification des permissions
    await wishlistItemService.addItemToWishlist(
      id,
      validatedData,
      session.user.id
    );

    return NextResponse.json(
      { message: "Article ajouté avec succès" },
      { status: 201 }
    );
  } catch (error) {
    // Gestion spécifique des erreurs Zod
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Données invalides",
          details: error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        },
        { status: 400 }
      );
    }

    const message = getErrorMessage(error);
    const status = message.includes("autorisé") ? 403 : 500;

    return NextResponse.json({ error: message }, { status });
  }
}
