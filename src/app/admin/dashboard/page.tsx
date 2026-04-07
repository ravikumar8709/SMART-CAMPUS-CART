'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/auth-provider';
import { signOut } from '@/lib/auth';
import { LogOut, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminDashboardPage() {
  const { user, refreshSession } = useAuth();
  const router = useRouter();

  const handleSignOut = () => {
    signOut();
    refreshSession();
    router.push('/login');
  };
  
  if (!user) {
      return null; // AuthProvider handles redirect
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
            <h1 className="text-3xl font-bold font-headline flex items-center">
                <Shield className="w-8 h-8 mr-3 text-primary" />
                Admin Dashboard
            </h1>
            <p className="text-muted-foreground">Welcome, {user.email}!</p>
        </div>
        <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
        </Button>
      </div>
       <Card className="glass-card">
          <CardHeader>
            <CardTitle>System Control</CardTitle>
            <CardDescription>
              This is the central control panel for the Campus Cart application.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>From here, you can manage users, vendors, and view system-wide analytics.</p>
            <p className="mt-4 text-sm text-muted-foreground">
                (Feature coming soon)
            </p>
          </CardContent>
        </Card>
    </div>
  );
}
