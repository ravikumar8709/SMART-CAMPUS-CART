'use client';

import { useState, useEffect } from 'react';
import type { Student } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/auth-provider';
import { signOut } from '@/lib/auth';
import { getStudentByEmail, rechargeWallet } from '@/lib/student-db';
import { LogOut, User, Wallet } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

export default function StudentDashboardPage() {
  const { user, refreshSession } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  const [student, setStudent] = useState<Student | null>(null);
  const [rechargeAmount, setRechargeAmount] = useState('');

  useEffect(() => {
    if (user) {
        const studentData = getStudentByEmail(user.email);
        setStudent(studentData);
    }
  }, [user]);

  const handleSignOut = () => {
    signOut();
    refreshSession();
    router.push('/student/login');
  };
  
  const handleRecharge = (e: React.FormEvent) => {
      e.preventDefault();
      const amount = parseFloat(rechargeAmount);
      if (!student || isNaN(amount) || amount <= 0) {
          toast({
              variant: 'destructive',
              title: 'Invalid Amount',
              description: 'Please enter a valid positive number to recharge.',
          });
          return;
      }
      
      // This modifies the in-memory array in student-db.ts
      rechargeWallet(student.id, amount); 
      
      // Get the updated student data from the "DB"
      const updatedStudent = getStudentByEmail(student.email);
      // Update the local state to trigger a re-render
      setStudent(updatedStudent);

      toast({
          title: 'Wallet Recharged!',
          description: `₹${amount.toFixed(2)} has been added to your wallet.`,
      });
      
      setRechargeAmount('');
  }
  
  if (!user || !student) {
      return null; // AuthProvider handles redirect
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
            <h1 className="text-3xl font-bold font-headline flex items-center">
                <User className="w-8 h-8 mr-3 text-primary" />
                Student Portal
            </h1>
            <p className="text-muted-foreground">Welcome, {student.name}!</p>
        </div>
        <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
        </Button>
      </div>
       <div className="grid md:grid-cols-2 gap-8">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center"><Wallet className="mr-3" /> Your Wallet</CardTitle>
            <CardDescription>
              Your current balance and recharge options.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold mb-4">₹{student.walletBalance.toFixed(2)}</p>
            <form onSubmit={handleRecharge} className="space-y-4">
                <Input 
                    type="number"
                    placeholder="Enter amount to recharge"
                    value={rechargeAmount}
                    onChange={(e) => setRechargeAmount(e.target.value)}
                    min="1"
                    step="10"
                />
                <Button type="submit" className="w-full">Recharge Wallet</Button>
            </form>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Purchase History</CardTitle>
             <CardDescription>
              A log of your recent transactions on campus.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <p className="mt-4 text-sm text-muted-foreground">
                (Feature coming soon)
            </p>
          </CardContent>
        </Card>
       </div>
    </div>
  );
}
