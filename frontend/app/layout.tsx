import type { Metadata } from "next";
import "./globals.css";
import AppLayout from "./layout-client";

export const metadata: Metadata = {
  title: "Project Blackbox",
  description: "수익형 유튜브 채널 자동화 SaaS",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
