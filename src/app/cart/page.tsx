'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CreditCard, ShoppingBag, Loader2, Nfc } from 'lucide-react';

import QuantitySelector from '@/components/quantity-selector';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useCart } from '@/contexts/cart-provider';
import { useToast } from '@/hooks/use-toast';
import { getStudentProfile } from '@/ai/flows/student-profile-flow';
import NfcScan from '@/components/nfc-scan';
import { updateStudentBalance } from '@/lib/student-db';
import { transactions } from '@/lib/data';
import { vendors } from '@/lib/data';


export default function CartPage() {
  const { state, dispatch } = useCart();
  const router = useRouter();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;

  const handleScanSuccess = async (scanResult: string) => {
    setIsProcessing(true);

    try {
      const student = await getStudentProfile(scanResult);

      if (!student) {
        toast({
          variant: 'destructive',
          title: 'Invalid Student ID',
          description: `The scanned ID (${scanResult}) is not a valid student ID. Please try again.`,
        });
        return;
      }
      
      if (student.walletBalance < total) {
        toast({
            variant: 'destructive',
            title: 'Insufficient Balance',
            description: `Your wallet balance is ₹${student.walletBalance.toFixed(2)}. Please recharge your wallet.`,
        });
        return;
      }

      // 1. Deduct balance from mock DB
      updateStudentBalance(student.id, student.walletBalance - total);

      // 2. Find vendor name from the first item in cart
      const vendorId = vendors.find(v => v.products.some(p => p.id === state.items[0]?.id))?.id;
      const vendor = vendors.find(v => v.id === vendorId);

      // 3. Create a new transaction record
      const newTransaction = {
        id: `t${Date.now()}`,
        vendorName: vendor?.name || 'Unknown Vendor',
        date: new Date().toISOString(),
        items: state.items.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price
        })),
        total: total,
      };

      // 4. Add to transaction history (in-memory)
      transactions.unshift(newTransaction);
      
      // 5. Clear cart
      dispatch({ type: 'CLEAR_CART' });
      
      // 6. Notify user and redirect
      toast({
        title: 'Purchase Successful!',
        description: `₹${total.toFixed(2)} has been deducted from your wallet.`,
      });

      setIsDialogOpen(false);
      router.push('/history');

    } catch (error) {
      console.error("Error during purchase:", error);
      toast({
        variant: 'destructive',
        title: 'Purchase Failed',
        description: 'An error occurred while trying to complete the purchase.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (state.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
         <ShoppingBag className="mx-auto h-24 w-24 text-muted-foreground" />
        <h1 className="mt-4 text-2xl font-bold">Your Cart is Empty</h1>
        <p className="mt-2 text-muted-foreground">Looks like you haven't added anything to your cart yet.</p>
        <Button asChild className="mt-6">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Start Shopping
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold font-headline mb-8">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {state.items.map(item => (
                  <div key={item.id} className="flex items-start gap-4">
                    <div className="flex-1">
                      <p className="font-semibold text-lg">{item.name}</p>
                      <p className="text-sm text-muted-foreground">₹{item.price.toFixed(2)} each</p>
                      <QuantitySelector 
                        quantity={item.quantity}
                        onQuantityChange={(newQuantity) => dispatch({ type: 'UPDATE_QUANTITY', payload: { productId: item.id, quantity: newQuantity }})}
                        max={item.stock}
                        className="mt-2"
                      />
                    </div>
                    <p className="font-semibold text-lg">₹{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 sticky top-24">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Total</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes & Fees</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-xl">
                <span>Order Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
              <Separator />
              
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" className="w-full mt-4">
                    <Nfc className="mr-2 h-5 w-5" />
                    Pay with Student ID
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass-card">
                  <DialogHeader>
                    <DialogTitle>Tap ID to Pay</DialogTitle>
                    <DialogDescription>
                      Hold your student ID card near your device. Your cart total of ₹{total.toFixed(2)} will be charged to your wallet.
                    </DialogDescription>
                  </DialogHeader>
                  {isProcessing ? (
                    <div className="flex flex-col items-center justify-center gap-4 py-8">
                      <Loader2 className="w-12 h-12 animate-spin text-primary" />
                      <p className="text-muted-foreground">Processing Purchase...</p>
                    </div>
                  ) : (
                    <NfcScan onScanSuccess={handleScanSuccess} />
                  )}
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
