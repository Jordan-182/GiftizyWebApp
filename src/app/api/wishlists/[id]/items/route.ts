/* ROUTE POST POUR AJOUTER UN ARTICLE DANS UNE LISTE SPECIFIQUE */

import { auth } from "@/lib/auth";
import { ItemCreateData } from "@/repositories/wishlistItemRepository";
import { wishlistItemService } from "@/services/wishlistItemService";
import { NextRequest, NextResponse } from "next/server";

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

    if (!body.name || !body.description || typeof body.price !== "number") {
      return NextResponse.json(
        { error: "Données invalides. Nom, description et prix sont requis." },
        { status: 400 }
      );
    }

    const item: ItemCreateData = {
      name: body.name,
      description: body.description,
      price: body.price,
    };

    await wishlistItemService.addItemToWishlist(id, item);

    return NextResponse.json(
      { message: "Article ajouté avec succès" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 400 }
    );
  }
}
