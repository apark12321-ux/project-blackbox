import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import AppLayout from "./layout-client";

export const metadata: Metadata = {
  title: "Project Blackbox",
  description: "수익형 유튜브 자동화 솔루션",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <Script src="https://cdn.tailwindcss.com" strategy="beforeInteractive" />
      </head>
      <body>
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
