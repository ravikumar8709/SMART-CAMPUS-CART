'use client';

import { ShoppingBag, LogOut, User, Shield } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';
import { useAuth } from '@/contexts/auth-provider';
import { signOut } from '@/lib/auth';
import { usePathname, useRouter } from 'next/navigation';

export default function Header() {
  const { user, role, refreshSession } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleSignOut = () => {
    signOut();
    refreshSession();
    let newPath = '/';
    if (role === 'Admin') {
      newPath = '/admin/login';
    } else if (role === 'Vendor') {
      newPath = '/vendor/login';
    } else if (role === 'Student') {
      newPath = '/student/login';
    }
    router.push(newPath);
  };
  
  const isLoginPage = pathname.endsWith('/login');

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/30 backdrop-blur-lg">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <ShoppingBag className="h-6 w-6 text-primary" />
          <span className="font-bold font-headline text-lg">Campus Cart</span>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-2">
            {user ? (
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="font-semibold">{user.displayName}</p>
                        <p className="text-xs text-muted-foreground">{role}</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={handleSignOut} aria-label="Log out">
                        <LogOut className="h-5 w-5" />
                    </Button>
                </div>
            ) : (
               !isLoginPage && (
                <Button asChild>
                  <Link href="/">Login</Link>
                </Button>
              )
            )}
        </div>
      </div>
    </header>
  );
}
