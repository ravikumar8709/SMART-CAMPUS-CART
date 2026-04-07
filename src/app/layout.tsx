import type { Metadata } from 'next';
import './globals.css';
import './print.css'; // Import print styles
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import { CartProvider } from '@/contexts/cart-provider';
import Header from '@/components/header';
import { cn } from '@/lib/utils';
import { AuthProvider } from '@/contexts/auth-provider';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Campus Cart',
  description: 'Seamless payments across campus.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={cn('font-body antialiased', inter.variable)}>
        <AuthProvider>
          <CartProvider>
            <div className="min-h-screen flex flex-col print:hidden">
              <Header />
              <main className="flex-1">{children}</main>
            </div>
            <Toaster />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
