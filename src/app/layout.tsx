import type { Metadata } from "next";
import { Montserrat, Roboto } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  display: 'swap',
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.elevateuacademy.in'),
  title: "Elevate U Academy",
  description: "Career-focused logistics and finance training.",
  alternates: {
    canonical: './',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} ${roboto.variable} antialiased bg-black text-white`}
      >
        {children}
      </body>
    </html>
  );
}
