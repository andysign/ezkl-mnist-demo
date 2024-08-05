import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: 'MNIST',
  description: 'Submit a hand-drawn digit and get the ZK ML proof then verify it',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
