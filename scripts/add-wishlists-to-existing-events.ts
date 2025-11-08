import { prisma } from "@/lib/prisma";

async function addWishlistsToExistingEvents() {
  console.log("🔍 Recherche des événements sans wishlist...");

  // Trouver tous les événements qui n'ont pas de wishlist
  const eventsWithoutWishlist = await prisma.event.findMany({
    where: {
      wishlist: null,
    },
    include: {
      host: {
        select: {
          id: true,
          name: true,
        },
      },
      profile: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  console.log(
    `📊 ${eventsWithoutWishlist.length} événement(s) trouvé(s) sans wishlist`
  );

  if (eventsWithoutWishlist.length === 0) {
    console.log("✅ Tous les événements ont déjà une wishlist !");
    return;
  }

  let successCount = 0;
  let errorCount = 0;

  for (const event of eventsWithoutWishlist) {
    try {
      console.log(`🔨 Création de la wishlist pour l'événement: ${event.name}`);

      // Déterminer le profil à utiliser pour la wishlist
      let wishlistProfileId = event.profileId;

      // Si aucun profil n'est spécifié, utiliser le profil principal de l'utilisateur
      if (!wishlistProfileId) {
        const mainProfile = await prisma.profile.findFirst({
          where: {
            userId: event.hostId,
            isMainProfile: true,
          },
          select: {
            id: true,
          },
        });

        if (!mainProfile) {
          console.error(
            `❌ Aucun profil principal trouvé pour l'utilisateur ${event.host.name} (événement: ${event.name})`
          );
          errorCount++;
          continue;
        }

        wishlistProfileId = mainProfile.id;
      }

      // Créer la wishlist
      await prisma.wishlist.create({
        data: {
          name: `${event.name}`,
          description: `Liste de cadeaux pour l'événement ${event.name}`,
          isEventWishlist: true,
          userId: event.hostId,
          profileId: wishlistProfileId,
          eventId: event.id,
        },
      });

      console.log(`✅ Wishlist créée pour l'événement: ${event.name}`);
      successCount++;
    } catch (error) {
      console.error(
        `❌ Erreur lors de la création de la wishlist pour l'événement ${event.name}:`,
        error
      );
      errorCount++;
    }
  }

  console.log("\n📈 Résumé:");
  console.log(`✅ ${successCount} wishlist(s) créée(s) avec succès`);
  console.log(`❌ ${errorCount} erreur(s)`);

  await prisma.$disconnect();
}

// Exécuter le script si c'est le fichier principal
if (require.main === module) {
  addWishlistsToExistingEvents()
    .then(() => {
      console.log("🎉 Script terminé !");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Erreur fatale:", error);
      process.exit(1);
    });
}

export { addWishlistsToExistingEvents };
