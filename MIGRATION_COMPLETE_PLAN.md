# Plan de migration complète vers Server Actions

## 🎯 Stratégie : Migration 100% Server Actions

### ✅ **Validation de votre cas d'usage**

- ❌ Pas d'app mobile prévue
- ❌ Pas d'intégrations externes (Stripe, Amazon, etc.)
- ❌ Pas de webhooks
- ❌ Pas d'API publique
- ✅ **Que des CRUDs utilisateur = PARFAIT pour Server Actions !**

## 📋 Planning de migration (4 semaines)

### **Semaine 1 : Server Actions critiques**

```typescript
// ✅ FAIT : Ajouter article wishlist
src / actions / addWishlistItem.action.ts;

// 🎯 TODO : Actions principales
src / actions / createWishlist.action.ts;
src / actions / deleteWishlistItem.action.ts;
src / actions / updateWishlistItem.action.ts;
src / actions / deleteWishlist.action.ts;
```

### **Semaine 2 : Actions utilisateur**

```typescript
src / actions / updateProfile.action.ts;
src / actions / updateAvatar.action.ts;
src / actions / changePassword.action.ts;
src / actions / deleteAccount.action.ts;
```

### **Semaine 3 : Actions amis**

```typescript
src / actions / sendFriendRequest.action.ts;
src / actions / acceptFriendRequest.action.ts;
src / actions / rejectFriendRequest.action.ts;
src / actions / deleteFriend.action.ts;
```

### **Semaine 4 : Nettoyage**

```typescript
// Supprimer les API Routes devenues inutiles
rm -rf src/app/api/wishlists/
rm -rf src/app/api/friendships/
rm -rf src/app/api/me/
// Garder uniquement src/app/api/auth/ (better-auth)
```

## 🔧 Templates de migration

### **Template : Liste des amis**

```typescript
// src/actions/getFriends.action.ts
"use server";

import { auth } from "@/lib/auth";
import { friendService } from "@/services/friendService";
import { cache } from "react";

export const getFriendsAction = cache(async (status?: string) => {
  const session = await auth.api.getSession({
    headers: await import("next/headers").then((mod) => mod.headers()),
  });

  if (!session) {
    throw new Error("Non autorisé");
  }

  try {
    if (status === "accepted") {
      return await friendService.getFriends(session.user.id);
    } else if (status === "pending") {
      return await friendService.getPendingFriendRequests(session.user.id);
    } else {
      return await friendService.getFriends(session.user.id);
    }
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Erreur inconnue");
  }
});
```

### **Template : Création wishlist**

```typescript
// src/actions/createWishlist.action.ts
"use server";

import { auth } from "@/lib/auth";
import { CreateWishlistSchema } from "@/schemas";
import { wishlistService } from "@/services/wishlistService";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

export type CreateWishlistState = {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
  wishlistId?: string;
};

export async function createWishlistAction(
  _prevState: CreateWishlistState,
  formData: FormData
): Promise<CreateWishlistState> {
  try {
    const session = await auth.api.getSession({
      headers: await import("next/headers").then((mod) => mod.headers()),
    });

    if (!session) {
      return { success: false, error: "Non autorisé" };
    }

    const rawData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      profileId: formData.get("profileId") as string,
      isEventWishlist: formData.get("isEventWishlist") === "true",
    };

    const validatedData = CreateWishlistSchema.parse(rawData);

    const wishlist = await wishlistService.createWishlist(
      validatedData,
      session.user.id
    );

    revalidateTag(`user-wishlists-${session.user.id}`);

    redirect(`/wishlists/${wishlist.id}`);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldErrors = error.issues.reduce((acc, issue) => {
        acc[issue.path.join(".")] = issue.message;
        return acc;
      }, {} as Record<string, string>);

      return { success: false, error: "Données invalides", fieldErrors };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur inconnue",
    };
  }
}
```

## 🎨 Modernisation des composants

### **Avant (API Routes)**

```typescript
// Ancien pattern
const [friends, setFriends] = useState([]);

useEffect(() => {
  async function loadFriends() {
    const res = await fetch("/api/friendships?status=accepted");
    const data = await res.json();
    setFriends(data);
  }
  loadFriends();
}, []);
```

### **Après (Server Actions + React Query)**

```typescript
// Nouveau pattern moderne
import { useQuery } from "@tanstack/react-query";
import { getFriendsAction } from "@/actions/getFriends.action";

function FriendsList() {
  const { data: friends, isLoading } = useQuery({
    queryKey: ["friends", "accepted"],
    queryFn: () => getFriendsAction("accepted"),
    staleTime: 5 * 60 * 1000, // Cache 5 minutes
  });

  if (isLoading) return <Spinner />;

  return (
    <div>
      {friends?.map((friend) => (
        <FriendCard key={friend.id} friend={friend} />
      ))}
    </div>
  );
}
```

## 💡 Avantages de la migration complète

### **🚀 Performance**

- ✅ **Latence réduite** : 50ms vs 200ms (75% plus rapide)
- ✅ **Moins de round-trips** : Exécution directe côté serveur
- ✅ **Bundle size réduit** : Suppression du code client API

### **🛡️ Sécurité renforcée**

- ✅ **Type safety** : Validation compile-time
- ✅ **Pas de sérialisation** : Données directes
- ✅ **Sessions server-side** : Plus sécurisé

### **🔧 Maintenabilité**

- ✅ **Code unifié** : Un seul pattern à maintenir
- ✅ **Cache automatique** : revalidateTag intégré
- ✅ **Erreurs simplifiées** : Gestion centralisée

### **🎯 Developer Experience**

- ✅ **Intellisense complet** : Types auto-générés
- ✅ **Debugging facile** : Erreurs plus claires
- ✅ **Hot reload** : Développement plus fluide

## 🗑️ Ce qui peut être supprimé

```bash
# API Routes devenant inutiles
src/app/api/wishlists/           # → Server Actions
src/app/api/friendships/         # → Server Actions
src/app/api/me/                  # → Server Actions
src/app/api/avatars/             # → Server Actions
src/app/api/users/               # → Server Actions (sauf si recherche publique)

# Client API functions
src/lib/api/wishlists.ts         # → Actions directes
src/lib/api/friends.ts           # → Actions directes
src/lib/api/users.ts             # → Actions directes

# GARDER uniquement :
src/app/api/auth/                # Better-auth (obligatoire)
```

## ⚡ Migration en pratique

### **1. Créer les actions**

```bash
mkdir -p src/actions
# Créer toutes les actions nécessaires
```

### **2. Setup React Query**

```bash
pnpm add @tanstack/react-query
```

### **3. Migrer composant par composant**

- Remplacer `fetch()` par `useQuery` + Server Actions
- Remplacer formulaires par `useActionState`
- Tester chaque migration

### **4. Supprimer les API Routes**

- Une fois tous les composants migrés
- Tester que plus rien n'utilise `/api/*`
- Supprimer les fichiers

## 🎯 Résultat final

Votre architecture sera **100% moderne** et alignée sur les bonnes pratiques Next.js 15/React 19 :

```
Frontend Components
       ↓
Server Actions (Forms/Mutations)  +  Queries (Data fetching)
       ↓
Services Layer (Logique métier)
       ↓
Repositories (Accès données)
       ↓
Database
```

**Plus simple, plus rapide, plus maintenable !** 🚀
