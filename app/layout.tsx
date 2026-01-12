import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TGA - Trading Growth Assistant",
  description: "Assistant intelligent pour suivre et optimiser votre challenge de trading",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
