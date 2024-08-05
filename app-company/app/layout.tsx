import type { Metadata } from "next";
import "./globals.css";
// import WagmiProvider from "@/providers/wagmi";

export const metadata: Metadata = {
  title: 'MNIST',
  description: 'Retrieve a previously created MNIST digit, infer the MNIST result and generate ZK proof of inference',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* <WagmiProvider> */}
        {children}
        {/* </WagmiProvider> */}
      </body>
    </html>
  );
}
