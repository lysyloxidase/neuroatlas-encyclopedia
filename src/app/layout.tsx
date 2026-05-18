import type { Metadata } from "next";
import { Navigation } from "@/components/layout/Navigation";
import "./globals.css";

export const metadata: Metadata = {
  title: "NeuroAtlas Encyclopedia",
  description: "Four-atlas, tiered reference backbone for human and mouse neuroanatomy.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <div className="site-shell">
          <Navigation />
          <main className="site-main">{children}</main>
          <footer className="footer">
            Educational resource. NOT medical advice or diagnosis. Always consult licensed clinicians for individual cases.
          </footer>
        </div>
      </body>
    </html>
  );
}
