import type { Metadata } from "next";
import "./globals.css";
import { UserProvider } from "@/hooks/use-user";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div>Home Layout</div>
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  );
}
