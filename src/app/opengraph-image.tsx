import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Route segment config - Commenté pour utiliser Node.js runtime et pouvoir lire les fichiers locaux
// export const runtime = "edge";

// Image metadata
export const alt = "Giftizy - Gestionnaire de listes de cadeaux";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

// Image generation
export default async function Image() {
  // Font loading, process.cwd() is Next.js project directory
  const modak = await readFile(join(process.cwd(), "assets/Modak-Regular.ttf"));

  // Logo loading
  const logoBuffer = await readFile(join(process.cwd(), "public/logo.png"));
  const logoBase64 = `data:image/png;base64,${logoBuffer.toString("base64")}`;
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: "50px",
          background: "linear-gradient(135deg, #1e293b 0%, #6366f1 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <img src={logoBase64} alt="Giftizy Logo" width="250" height="250" />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: "0",
          }}
        >
          <h1
            style={{
              fontSize: 96,
              fontWeight: "normal",
              fontFamily: "Modak",
              color: "white",
              textAlign: "center",
            }}
          >
            Giftizy
          </h1>
          <h2
            style={{
              fontSize: 32,
              color: "rgba(255, 255, 255, 0.9)",
              textAlign: "center",
              maxWidth: 800,
            }}
          >
            Créez et partagez vos listes de cadeaux facilement
          </h2>
        </div>
      </div>
    ),
    // ImageResponse options
    {
      ...size,
      fonts: [
        {
          name: "Modak",
          data: modak,
          style: "normal",
          weight: 400,
        },
      ],
    }
  );
}
