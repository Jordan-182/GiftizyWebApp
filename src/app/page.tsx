import GetStartedButton from "@/components/GetStartedButton";
import { Calendar, Gift, Heart, Shield, Star, Users } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen w-screen -mx-8 -mt-29 -mb-8 relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-br from-primary/5 via-background to-accent/5">
        <div className="absolute inset-0 bg-grid-slate-100 mask-[linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25"></div>
        <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-8 mt-6 flex justify-center">
              <div className="rounded-full bg-primary/10 p-4">
                <Image
                  src={"/logo.png"}
                  alt="Logo Giftizy"
                  height={150}
                  width={150}
                />
              </div>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
                Giftizy
              </span>
            </h1>
            <p className="font-bold mt-6 text-xl leading-8 text-muted-foreground sm:text-2xl">
              Partagez vos envies, simplifiez les cadeaux
            </p>
            <p className="mt-4 text-lg leading-7 text-muted-foreground max-w-2xl mx-auto">
              L&apos;application qui révolutionne l&apos;art d&apos;offrir en
              permettant de créer, partager et gérer vos listes de souhaits avec
              vos proches.
            </p>
            <div className="mt-10">
              <GetStartedButton />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 sm:py-32 bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-base font-semibold leading-7 text-primary-foreground/80">
              Fonctionnalités
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
              Tout ce dont vous avez besoin pour des cadeaux parfaits
            </p>
            <p className="mt-6 text-lg leading-8 text-primary-foreground/80">
              Découvrez comment Giftizy transforme l&apos;expérience du cadeau
              en moment de plaisir partagé.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-lg bg-primary-foreground/10">
                  <Gift className="h-8 w-8 text-primary-foreground" />
                </div>
                <dt className="text-xl font-semibold leading-7 text-primary-foreground">
                  Listes de souhaits personnalisées
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-primary-foreground/80">
                  <p className="flex-auto">
                    Créez des wishlists détaillées. Organisez vos envies par
                    catégories et occasions.
                  </p>
                </dd>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-lg bg-primary-foreground/10">
                  <Users className="h-8 w-8 text-primary-foreground" />
                </div>
                <dt className="text-xl font-semibold leading-7 text-primary-foreground">
                  Partage entre amis et famille
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-primary-foreground/80">
                  <p className="flex-auto">
                    Connectez-vous avec vos proches grâce à un système
                    d&apos;amis simple. Partagez vos listes et découvrez celles
                    de vos amis.
                  </p>
                </dd>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-lg bg-primary-foreground/10">
                  <Calendar className="h-8 w-8 text-primary-foreground" />
                </div>
                <dt className="text-xl font-semibold leading-7 text-primary-foreground">
                  Événements et occasions
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-primary-foreground/80">
                  <p className="flex-auto">
                    Organisez vos cadeaux autour d&apos;événements spéciaux :
                    anniversaires, Noël, mariages et plus encore.
                  </p>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-base font-semibold leading-7 text-primary">
              Comment ça marche
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Simple comme bonjour
            </p>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              En quelques étapes seulement, vous serez prêt à transformer vos
              moments de cadeaux.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-3">
              <div className="relative">
                <div className="absolute -top-4 -left-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-lg">
                  1
                </div>
                <h3 className="text-xl font-semibold leading-7 text-foreground mb-4 ml-8">
                  Créez votre compte
                </h3>
                <p className="text-base leading-7 text-muted-foreground ml-8">
                  Inscrivez-vous en quelques secondes avec votre email ou votre
                  compte Google. C&apos;est gratuit et sécurisé.
                </p>
              </div>
              <div className="relative">
                <div className="absolute -top-4 -left-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-lg">
                  2
                </div>
                <h3 className="text-xl font-semibold leading-7 text-foreground mb-4 ml-8">
                  Ajoutez vos envies
                </h3>
                <p className="text-base leading-7 text-muted-foreground ml-8">
                  Créez vos premières listes de souhaits et ajoutez tout ce qui
                  vous fait envie.
                </p>
              </div>
              <div className="relative">
                <div className="absolute -top-4 -left-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-lg">
                  3
                </div>
                <h3 className="text-xl font-semibold leading-7 text-foreground mb-4 ml-8">
                  Partagez avec vos proches
                </h3>
                <p className="text-base leading-7 text-muted-foreground ml-8">
                  Invitez vos amis et famille, découvrez leurs listes et
                  réservez des cadeaux en toute discrétion.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 sm:py-32 bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-base font-semibold leading-7 text-primary-foreground/80">
              Pourquoi Giftizy ?
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
              Les avantages qui font la différence
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <div className="flex gap-4">
                <div className="flex-none">
                  <Heart className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold leading-7 text-primary-foreground">
                    Plus de cadeaux ratés
                  </h3>
                  <p className="mt-2 text-base leading-7 text-primary-foreground/80">
                    Fini les cadeaux qui ne plaisent pas ! Vos proches savent
                    exactement ce qui vous ferait plaisir.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-none">
                  <Star className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold leading-7 text-primary-foreground">
                    Surprises préservées
                  </h3>
                  <p className="mt-2 text-base leading-7 text-primary-foreground/80">
                    Le système de réservation permet de garder la surprise tout
                    en étant sûr de faire plaisir.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-none">
                  <Shield className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold leading-7 text-primary-foreground">
                    Sécurisé et privé
                  </h3>
                  <p className="mt-2 text-base leading-7 text-primary-foreground/80">
                    Vos données sont protégées et vous contrôlez qui peut voir
                    vos listes de souhaits.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-none">
                  <Users className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold leading-7 text-primary-foreground">
                    Famille connectée
                  </h3>
                  <p className="mt-2 text-base leading-7 text-primary-foreground/80">
                    Renforcez les liens avec vos proches en partageant vos
                    envies et en découvrant les leurs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Prêt à transformer vos moments de cadeaux ?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
              Rejoignez des milliers d&apos;utilisateurs qui ont déjà adopté
              Giftizy pour des cadeaux parfaits à chaque occasion.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <GetStartedButton />
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Gratuit • Aucune carte bancaire requise • Configuration en 2
              minutes
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
