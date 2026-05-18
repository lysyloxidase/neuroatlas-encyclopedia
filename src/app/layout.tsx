import type { Metadata } from "next";
import { Navigation } from "@/components/layout/Navigation";
import "./globals.css";

export const metadata: Metadata = {
  title: "NeuroAtlas Encyclopedia",
  description:
    "Four-atlas, tiered reference backbone for human and mouse neuroanatomy.",
  applicationName: "NeuroAtlas Encyclopedia",
  metadataBase: new URL(
    "https://github.com/lysyloxidase/neuroatlas-encyclopedia",
  ),
  openGraph: {
    title: "NeuroAtlas Encyclopedia",
    description:
      "Tiered neuroanatomy encyclopedia with atlas, cellular, network, disorder, and development views.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <div className="site-shell">
          <a className="skip-link" href="#main-content">
            Skip to content
          </a>
          <Navigation />
          <main className="site-main" id="main-content">
            {children}
          </main>
          <footer className="footer">
            <span>
              Educational resource. NOT medical advice or diagnosis. Always
              consult licensed clinicians for individual cases.
            </span>
            <span>
              <a href="/acknowledgments">Acknowledgments</a> ·{" "}
              <a href="/caveats">Caveats</a>
            </span>
          </footer>
        </div>
      </body>
    </html>
  );
}
