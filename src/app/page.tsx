'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingBag, Shield, Store, User } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="text-center py-16">
        <div className="mx-auto max-w-2xl">
          <div className="inline-block bg-primary/10 p-4 rounded-full mb-4">
            <ShoppingBag className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight text-foreground">
            Welcome to Campus Cart
          </h1>
          <p className="mt-4 text-lg text-foreground/90">
            The all-in-one point-of-sale system for campus vendors.
          </p>
        </div>
      </section>

      <section className="py-8">
        <h2 className="text-3xl font-bold font-headline text-center mb-10">Select Your Portal</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Link href="/student/login">
            <Card className="glass-card text-center transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 h-full">
              <CardHeader>
                <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                    <User className="w-10 h-10 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="font-headline text-2xl mb-2">Student Portal</CardTitle>
                <CardDescription className="text-base">Log in to view your balance and recharge your wallet.</CardDescription>
                 <Button className="mt-6">Go to Student Login</Button>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/vendor/login">
            <Card className="glass-card text-center transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 h-full">
              <CardHeader>
                <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                    <Store className="w-10 h-10 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="font-headline text-2xl mb-2">Vendor Portal</CardTitle>
                <CardDescription className="text-base">Log in to manage your products, view sales, and process customer orders.</CardDescription>
                 <Button className="mt-6">Go to Vendor Login</Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/login">
             <Card className="glass-card text-center transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 h-full">
               <CardHeader>
                 <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                    <Shield className="w-10 h-10 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="font-headline text-2xl mb-2">Admin Portal</CardTitle>
                <CardDescription className="text-base">Access the system-wide dashboard to manage vendors and oversee all operations.</CardDescription>
                <Button className="mt-6">Go to Admin Login</Button>
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>
    </div>
  );
}
