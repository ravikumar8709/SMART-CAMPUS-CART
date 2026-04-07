'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { signIn } from '@/lib/auth';
import { useAuth } from '@/contexts/auth-provider';

export default function VendorLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { refreshSession, user, loading } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = signIn(email, password);
      
      if (user) {
        refreshSession();
        toast({
          title: 'Login Successful',
          description: `Redirecting to dashboard...`,
        });
        router.push('/vendor/dashboard');
      } else {
         toast({
            variant: 'destructive',
            title: 'Login Failed',
            description: 'Invalid email or password. Please try again.',
        });
      }
    } catch (error: any) {
      console.error("Sign-in failed", error);
      toast({
        variant: 'destructive',
        title: 'Sign In Failed',
        description: error.message || 'An unexpected error occurred.',
      });
    }
  };

  if (loading || user) {
    return (
       <div className="w-full h-screen flex items-center justify-center">
            <p>Loading...</p>
       </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-10rem)] py-12 px-4">
      <Card className="w-full max-w-md glass-card">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-3xl font-bold font-headline">Vendor Login</CardTitle>
          <CardDescription>Enter your credentials to access your dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignIn} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="vendor@example.com" required value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required value={password} onChange={e => setPassword(e.target.value)} />
            </div>
             <Button type="submit" className="w-full text-base py-6">
              Sign In
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
