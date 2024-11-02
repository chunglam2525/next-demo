import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Joe Yip Website",
  description: "Personal website written in NextJs. Demonstrating skills and providing personal information to anyone who is interested.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
