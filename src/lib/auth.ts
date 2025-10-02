import { sendEmailAction } from "@/actions/sendEmail.action";
import { UserRole } from "@/generated/prisma";
import { hashPassword, verifyPassword } from "@/lib/argon2";
import { ac, roles } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { getValidDomains, normalizeName } from "@/lib/utils";
import { betterAuth, type BetterAuthOptions } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
import { admin, customSession, magicLink } from "better-auth/plugins";

const options = {
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  socialProviders: {
    google: {
      clientId: String(process.env.GOOGLE_CLIENT_ID),
      clientSecret: String(process.env.GOOGLE_CLIENT_SECRET),
    },
  },
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    autoSignIn: false,
    password: {
      hash: hashPassword,
      verify: verifyPassword,
    },
    requireEmailVerification: true,
    resetPasswordTokenExpiresIn: 60 * 60,
    sendResetPassword: async ({ user, url }) => {
      await sendEmailAction({
        to: user.email,
        subject: "Réinitialisation de mot de passe",
        meta: {
          description:
            "Veuillez cliquer sur le lien ci-dessous pour réinitialiser votre mot de passe",
          link: url,
        },
      });
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    expiresIn: 60 * 60,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      const link = new URL(url);
      link.searchParams.set("callbackURL", "/auth/verify");
      await sendEmailAction({
        to: user.email,
        subject: "Vérifiez votre adresse email",
        meta: {
          description:
            "Veuillez vérifier votre adresse email afin de compléter votre inscription.",
          link: String(link),
        },
      });
    },
  },
  hooks: {
    before: createAuthMiddleware(async (context) => {
      if (context.path === "/sign-up/email") {
        const email = String(context.body.email);
        const domain = email.split("@")[1];
        const VALID_DOMAINS = getValidDomains();
        if (!VALID_DOMAINS.includes(domain)) {
          throw new APIError("BAD_REQUEST", {
            message: "INVALID_DOMAIN",
          });
        }

        return {
          context: {
            ...context,
            body: { ...context.body, name: normalizeName(context.body.name) },
          },
        };
      }

      if (context.path === "/sign-in/magic-link") {
        return {
          context: {
            ...context,
            body: { ...context.body, name: normalizeName(context.body.name) },
          },
        };
      }

      if (context.path === "/update-user") {
        return {
          context: {
            ...context,
            body: { ...context.body, name: normalizeName(context.body.name) },
          },
        };
      }
    }),
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(";") ?? [];
          if (ADMIN_EMAILS.includes(user.email)) {
            return { data: { ...user, role: UserRole.ADMIN } };
          }
          return { data: user };
        },
      },
    },
  },
  user: {
    additionalFields: {
      role: {
        type: ["USER", "ADMIN"] as Array<UserRole>,
        input: false,
      },
    },
  },
  session: {
    expiresIn: 30 * 24 * 60 * 60,
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
  account: {
    accountLinking: {
      enabled: false,
    },
  },
  advanced: {
    database: {
      generateId: false,
    },
  },
  plugins: [
    nextCookies(),
    admin({
      defaultRole: UserRole.USER,
      adminRoles: [UserRole.ADMIN],
      ac,
      roles,
    }),
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        await sendEmailAction({
          to: email,
          subject: "Connexion avec le Magic Link",
          meta: {
            description: "Cliquez sur le lien ci-dessous pour vous connecter",
            link: url,
          },
        });
      },
    }),
  ],
} satisfies BetterAuthOptions;

export const auth = betterAuth({
  ...options,
  plugins: [
    ...(options.plugins ?? []),
    customSession(async ({ user, session }) => {
      return {
        session: {
          createdAt: session.createdAt,
          updatedAt: session.updatedAt,
          expiresAt: session.expiresAt,
          token: session.token,
          ipAddress: session.ipAddress,
          userAgent: session.userAgent,
          userId: session.userId,
        },
        user: {
          id: user.id,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          name: user.name,
          email: user.email,
          emailVerified: user.emailVerified,
          image: user.image,
          role: user.role,
          banExpires: user.banExpires,
          banReason: user.banReason,
          banned: user.banned,
        },
      };
    }, options),
  ],
});

export type ErrorCode =
  | keyof typeof auth.$ERROR_CODES
  | "UNKNOWN"
  | "INVALID_DOMAIN";
