import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Cormorant_Garamond, Pinyon_Script } from "next/font/google";
import "./globals.css";

const display = Bodoni_Moda({ variable: "--f-display", subsets: ["latin"], style: ["normal", "italic"] });
const body = Cormorant_Garamond({
  variable: "--f-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});
const script = Pinyon_Script({ variable: "--f-script", subsets: ["latin"], weight: "400" });

export const metadata: Metadata = {
  title: "The Two of Us — Five Years",
  description: "A personal magazine. Print run of one.",
};

export const viewport: Viewport = {
  themeColor: "#14080b",
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${script.variable}`}>
      <body>{children}</body>
    </html>
  );
}
