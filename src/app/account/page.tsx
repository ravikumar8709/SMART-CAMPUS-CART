'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/auth-provider';
import { signOut } from '@/lib/auth';
import { getStudentById, rechargeWallet } from '@/lib/student-db';
import type { Student } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, History, LogOut, User as UserIcon, Wallet, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AccountPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [student, setStudent] = useState<Student | null>(null);
  const [rechargeAmount, setRechargeAmount] = useState('');

  // This is a mock: In a real app, you'd link the Firebase user to your student database.
  // Here, we'll just fetch a hardcoded student profile to demonstrate the wallet functionality.
  const studentIdToDisplay = '99220040182';

  const fetchStudentData = () => {
    // In a real app, this might be an API call.
    const data = getStudentById(studentIdToDisplay);
    setStudent(data);
  };

  useEffect(() => {
    fetchStudentData();
  }, []);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  const handleRecharge = () => {
    const amount = parseFloat(rechargeAmount);
    if (!student || isNaN(amount) || amount <= 0) {
      toast({
        variant: 'destructive',
        title: 'Invalid Amount',
        description: 'Please enter a valid positive number to recharge.',
      });
      return;
    }

    rechargeWallet(student.id, amount);
    fetchStudentData(); // Re-fetch data to show updated balance
    setRechargeAmount('');
    toast({
      title: 'Recharge Successful!',
      description: `₹${amount.toFixed(2)} has been added to your wallet.`,
    });
  };

  if (!user) {
    // This part remains, as it's good practice.
    return (
      <div className="container mx-auto max-w-3xl px-4 py-8 text-center">
        <p>You must be logged in to view this page.</p>
        <Button asChild className="mt-4">
          <Link href="/login">Login</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <div className="flex items-center mb-8">
        <UserIcon className="w-8 h-8 text-primary mr-3" />
        <h1 className="text-3xl font-bold font-headline">My Account</h1>
      </div>

      <Card className="mb-8 glass-card">
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarFallback>{user.displayName?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl font-headline">{user.displayName}</CardTitle>
            <CardDescription>{user.email}</CardDescription>
          </div>
        </CardHeader>
      </Card>

      <div className="space-y-8">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-xl font-headline flex items-center">
              <Wallet className="w-5 h-5 mr-3 text-primary" />
              Student Wallet
            </CardTitle>
            <CardDescription>Your current balance and recharge options.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 border rounded-md mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Current Balance</p>
                <p className="text-3xl font-bold">₹{student ? student.walletBalance.toFixed(2) : '0.00'}</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="recharge-amount">Recharge Amount</Label>
              <div className="flex gap-2">
                <Input
                  id="recharge-amount"
                  type="number"
                  placeholder="e.g., 500"
                  value={rechargeAmount}
                  onChange={(e) => setRechargeAmount(e.target.value)}
                />
                <Button onClick={handleRecharge}>
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Recharge
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-xl font-headline flex items-center">
              <CreditCard className="w-5 h-5 mr-3 text-primary" />
              Payment Methods
            </CardTitle>
            <CardDescription>Manage your saved payment methods.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 border rounded-md">
              <div>
                <p className="font-medium">Visa ending in 1234</p>
                <p className="text-sm text-muted-foreground">Expires 12/2025</p>
              </div>
              <Button variant="outline">Edit</Button>
            </div>
            <Button variant="secondary" className="mt-4 w-full">Add New Payment Method</Button>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-xl font-headline flex items-center">
              <History className="w-5 h-5 mr-3 text-primary" />
              Order History
            </CardTitle>
            <CardDescription>View your past transactions and receipts.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/history">View Transaction History</Link>
            </Button>
          </CardContent>
        </Card>

        <Separator />

        <Button variant="destructive" className="w-full" onClick={handleSignOut}>
          <LogOut className="w-4 h-4 mr-2" />
          Log Out
        </Button>
      </div>
    </div>
  );
}
