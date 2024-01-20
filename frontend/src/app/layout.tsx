'use client';
import { Header } from '@/components/header';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Inter } from 'next/font/google';
import { sepolia } from 'viem/chains';
import { WagmiProvider, createConfig, http } from 'wagmi';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

const queryClient = new QueryClient();
const config = createConfig({
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(),
  },
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <Header />
            {children}
          </QueryClientProvider>
        </WagmiProvider>
      </body>
    </html>
  );
}
