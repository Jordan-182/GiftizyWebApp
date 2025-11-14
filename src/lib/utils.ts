import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getValidDomains() {
  const domains = [
    // Fournisseurs internationaux populaires en France
    "gmail.com",
    "yahoo.com",
    "yahoo.fr",
    "hotmail.com",
    "hotmail.fr",
    "outlook.com",
    "outlook.fr",
    "live.com",
    "live.fr",

    // Fournisseurs français
    "orange.fr",
    "wanadoo.fr",
    "free.fr",
    "laposte.net",
    "sfr.fr",
    "bbox.fr",
    "numericable.fr",
    "club-internet.fr",
    "neuf.fr",
    "voila.fr",
    "tiscali.fr",
    "alice.fr",
    "cegetel.net",

    // Autres domaines courants
    "icloud.com",
    "me.com",
    "mac.com",
    "protonmail.com",
    "tutanota.com",
  ];

  if (process.env.NODE_ENV === "development") {
    domains.push("exemple.com");
  }
  return domains;
}

export function normalizeName(name: string) {
  return name
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[^a-zA-Z\s'-]/g, "")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}
