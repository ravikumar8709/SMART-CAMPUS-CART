'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { vendors } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Store, Utensils } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="text-center py-16">
        <div className="mx-auto max-w-2xl">
          <div className="inline-block bg-primary/10 p-4 rounded-full mb-4">
            <Utensils className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight text-foreground">
            Welcome to Campus Cart
          </h1>
          <p className="mt-4 text-lg text-foreground/90">
            Your one-stop solution for seamless payments at any vendor across campus. Tap, pay, and go!
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="flex items-center justify-center mb-10">
           <Store className="w-8 h-8 text-primary mr-3" />
          <h2 className="text-3xl font-bold font-headline text-center">Browse Vendors</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {vendors.map((vendor) => (
            <Link href={`/vendors/${vendor.id}`} key={vendor.id} className="group">
              <Card className={cn('glass-card overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-2xl hover:-translate-y-2')}>
                <CardContent className="p-6 flex-1 flex flex-col">
                    <CardTitle className="font-headline text-2xl mb-2">{vendor.name}</CardTitle>
                    <CardDescription className="text-base">{vendor.description}</CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
