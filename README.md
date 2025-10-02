# Giftizy 🎁

Giftizy est une application web de partage de **wishlists** entre amis et famille.  
L’objectif est de simplifier l’organisation des cadeaux en permettant aux utilisateurs de créer, gérer et partager leurs envies en toute simplicité.

---

## 🚀 Stack technique

- **Framework** : [Next.js 15.5.4](https://nextjs.org/)
- **UI** : [React 19.1.0](https://react.dev/)
- **Base de données** : [PostgreSQL](https://www.postgresql.org/)
- **ORM** : [Prisma](https://www.prisma.io/)
- **Authentification** : [BetterAuth](https://better-auth.com/)
- **Emails** : [Nodemailer](https://nodemailer.com/) (vérification de compte & reset password)
- **Styling** : [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Notifications** : [Sonner](https://sonner.emilkowal.ski/)

---

## ⚙️ Installation & lancement

### 1. Cloner le projet

```bash
git clone https://github.com/ton-compte/giftizy.git
cd giftizy
```

### 2. Installer les dépendances

```bash
pnpm install
```

### 3. Variables d’environnement

Crée un fichier .env à la racine avec le contenu suivant :

```bash
# Url de l'api
NEXT_PUBLIC_API_URL="http://localhost:3000"

# Base de données
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/giftizy"

# Authentification
BETTER_AUTH_SECRET="super-secret-key"
BETTER_AUTH_URL="http://localhost:3000"

# Admins : Les mails dont les comptes seront automatiquement ADMIN
ADMIN_EMAILS="mark@exemple.com;tom@exemple.com;travis@exemple.com"

# Identification avec Google Auth
GOOGLE_CLIENT_ID="GoogleClientID"
GOOGLE_CLIENT_SECRET="GoogleClientSecret"

# Nodemailer pour l'envoi des mails (app password à configurer, pas le mdp de base)
NODEMAILER_USER="mail@exemple.com"
NODEMAILER_APP_PASSWORD="passwordAPP"
```

### 4. Générer le client Prisma

```bash
npx prisma generate
```

### 5. Exécuter les migrations

```bash
npx prisma migrate dev
```

### 6. Lancer le serveur de dev

```bash
pnpm dev
```

L’application est maintenant accessible sur http://localhost:3000 🎉

## 📂 Structure du projet

```bash
.
├── prisma/            # Schéma et migrations Prisma
├── src/
│   ├── app/           # Routes Next.js (App Router)
│   ├── components/    # Composants UI (shadcn, custom)
│   ├── lib/           # Utils (auth, db, mail, helpers)
│   ├── styles/        # Fichiers Tailwind CSS
│   └── hooks/         # Custom React hooks
└── ...

```

## 📨 Emails

- Vérification de compte : envoi d’un email avec lien ou code à saisir
- Mot de passe oublié : envoi d’un email avec lien de réinitialisation
- Géré via Nodemailer avec un transport SMTP configurable

## 🎨 UI & UX

- Composants accessibles et modernes avec shadcn/ui
- Thème clair/sombre avec Tailwind
- Notifications toast avec Sonner

## 🛠️ Scripts utiles

```bash
pnpm dev        # Lancer en mode dev
pnpm build      # Build de production
pnpm start      # Lancer en mode production
pnpm lint       # Vérifier le code

```

## 📝 Licence

Ce projet est distribué sous licence MIT.
