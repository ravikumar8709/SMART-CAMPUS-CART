'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { usePathname, useRouter } from 'next/navigation';
import type { Role, MockUser } from '@/lib/types';
import { getSession } from '@/lib/auth';

interface AuthContextType {
  user: MockUser | null;
  role: Role | null;
  loading: boolean;
  refreshSession: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<MockUser | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const refreshSession = () => {
    const sessionUser = getSession();
    setUser(sessionUser);
    setRole(sessionUser?.role || null);
    setLoading(false);
  };

  useEffect(() => {
    refreshSession();
  }, []);

  useEffect(() => {
    if (loading) return;

    const isStudentRoute = pathname.startsWith('/student');
    const isVendorRoute = pathname.startsWith('/vendor');
    const isAdminRoute = pathname.startsWith('/admin');
    const isStudentLogin = pathname === '/student/login';
    const isVendorLogin = pathname === '/vendor/login';
    const isAdminLogin = pathname === '/admin/login';
    
    // If not logged in, redirect protected routes to their respective login pages
    if (!user) {
      if (isVendorRoute && !isVendorLogin) {
        router.push('/vendor/login');
        return;
      }
      if (isAdminRoute && !isAdminLogin) {
        router.push('/admin/login');
        return;
      }
      if (isStudentRoute && !isStudentLogin) {
        router.push('/student/login');
        return;
      }
      return;
    }
    
    // If logged in, handle redirects
    if (user) {
      // Redirect from login pages if already logged in
      if (isStudentLogin && role === 'Student') {
          router.push('/student/dashboard');
          return;
      }
      if (isVendorLogin && role === 'Vendor') {
          router.push('/vendor/dashboard');
          return;
      }
      if (isAdminLogin && role === 'Admin') {
          router.push('/admin/dashboard');
          return;
      }

      // Enforce role-based access
      if (role === 'Student' && (isAdminRoute || isVendorRoute)) {
        router.push('/student/dashboard');
      } else if (role === 'Vendor' && (isAdminRoute || isStudentRoute)) {
        router.push('/vendor/dashboard');
      } else if (role === 'Admin' && (isVendorRoute || isStudentRoute)) {
        router.push('/admin/dashboard');
      }
    }

  }, [user, role, loading, pathname, router]);

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      </div>
    );
  }

  const value = { user, role, loading, refreshSession };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
