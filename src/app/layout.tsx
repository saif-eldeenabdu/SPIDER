import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Web of Decisions | Make Better Choices",
  description: "Navigate life's toughest choices with data-driven clarity. A decision-making tool with weighted pros/cons, mood analysis, and regret simulation.",
  icons: {
    icon: [
      {
        url: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='40' fill='%23C1121F'/><circle cx='50' cy='50' r='25' fill='%230D0D0D'/><circle cx='50' cy='50' r='10' fill='%23C1121F'/><line x1='50' y1='10' x2='50' y2='90' stroke='%230D0D0D' stroke-width='2'/><line x1='10' y1='50' x2='90' y2='50' stroke='%230D0D0D' stroke-width='2'/><line x1='22' y1='22' x2='78' y2='78' stroke='%230D0D0D' stroke-width='2'/><line x1='78' y1='22' x2='22' y2='78' stroke='%230D0D0D' stroke-width='2'/></svg>",
        type: "image/svg+xml",
      },
    ],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0D0D0D",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
