import { AppShell } from "@/common/components/layout/app-shell";
import { AppProviders } from "@/common/providers/app-providers";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SupportHub Admin",
  description: "Customer support admin built with @jyh-dev/kit.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="overflow-hidden">
        <AppProviders>
          <AppShell>{children}</AppShell>
        </AppProviders>
      </body>
    </html>
  );
}
