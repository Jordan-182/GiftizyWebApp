import ReturnButton from "@/components/returnButton";

export default function LegalsPage() {
  return (
    <article className="max-w-3xl mx-auto prose space-y-4">
      <ReturnButton href="/" label="Retour" />
      <h1 className="text-3xl font-bold mb-4">Mentions légales</h1>

      <section>
        <h2 className="text-xl font-bold mb-2">Éditeur de l'application</h2>
        <p>
          Nom de l'application : <strong>Giftizy</strong> <br />
          Concepteur et développeur : <strong>Jordan Pieton</strong> <br />
          Responsable de la publication : <strong>Jordan Pieton</strong> <br />
          Statut : <strong>Projet personnel étudiant</strong>
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-2">Hébergement</h2>
        <p className="mb-2">
          L'application est hébergée par : <strong>Vercel Inc</strong>.<br />
          340 S Lemon Ave #4133
          <br />
          Walnut, CA91789, Etats-Unis <br />
          Site web : <a href="https://vercel.com">https://vercel.com</a>.
        </p>
        <p>
          La base de données est hébergée par : <strong>Alwaysdata</strong>.
          <br />
          91 rue du Faubourg Saint-Honoré
          <br />
          75008 Paris, France 91789 <br />
          Site web :{" "}
          <a href="https://www.alwaysdata.com">https://www.alwaysdata.com</a>.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-2">Propriété intellectuelle</h2>
        <p>
          L'ensemble des éléments (textes, images, graphismes, logos, icônes,
          sons, logiciels, etc.) présents sur ce site est protégé par le droit
          de la propriété intellectuelle et appartient à l'éditeur du site ou à
          des tiers ayant autorisé l'éditeur à les utiliser. Toute reproduction,
          représentation, modification, publication, adaptation de tout ou
          partie des éléments du site, quel que soit le moyen ou le procédé
          utilisé, est interdite sauf autorisation écrite préalable de
          l'éditeur.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-2">Données personnelles</h2>
        <p>
          L’application peut stocker certaines données personnelles afin
          d’assurer son bon fonctionnement. Ces données sont conservées de
          manière sécurisée et ne sont jamais revendues ni partagées avec des
          tiers. Conformément au Règlement Général sur la Protection des Données
          (RGPD), vous pouvez demander à accéder, corriger ou supprimer vos
          données à tout moment en nous contactant à l'adresse :{" "}
          <strong>giftizy.app@gmail.com</strong>
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-2">Cookies</h2>
        <p>
          Le site peut utiliser des cookies pour améliorer l'expérience
          utilisateur. Vous pouvez gérer vos préférences en matière de cookies
          via les paramètres de votre navigateur.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-2">Responsabilité</h2>
        <p>
          L'éditeur met en œuvre tous les moyens raisonnables pour assurer
          l'exactitude et la mise à jour des informations diffusées sur le site,
          mais ne saurait garantir l'exactitude, la complétude ou l'actualité
          des informations. L'utilisateur est seul responsable de l'usage des
          informations disponibles sur le site. <br />
          Ce projet est fourni "en l'état", sans garantie. L’éditeur ne saurait
          être tenu responsable en cas de bug, perte de données, ou mauvais
          fonctionnement du service.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-2">Liens hypertextes</h2>
        <p>
          Les liens hypertextes présents sur le site peuvent renvoyer vers
          d'autres sites. L'éditeur n'est pas responsable du contenu de ces
          sites externes et décline toute responsabilité quant aux informations
          qui y sont diffusées.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-2">
          Modification des mentions légales
        </h2>
        <p>
          L'éditeur se réserve le droit de modifier les présentes mentions
          légales à tout moment. Les utilisateurs sont invités à les consulter
          régulièrement.
        </p>
      </section>

      <footer>
        <p className="text-sm text-slate-600">
          Dernière mise à jour : <strong>17/11/2025</strong>
        </p>
      </footer>
    </article>
  );
}
