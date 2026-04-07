'use client';

import { useMemo, useState, useRef, forwardRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { signOut } from '@/lib/auth';
import { vendors, transactions } from '@/lib/data';
import type { Product, Student, Transaction } from '@/lib/types';
import { useCart } from '@/contexts/cart-provider';
import { useToast } from '@/hooks/use-toast';
import { getStudentProfile } from '@/ai/flows/student-profile-flow';
import { updateStudentBalance } from '@/lib/student-db';
import NfcScan from '@/components/nfc-scan';
import QuantitySelector from '@/components/quantity-selector';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useReactToPrint } from 'react-to-print';
import PrintableReceipt from '@/components/printable-receipt';
import { LogOut, Plus, CheckCircle, Trash2, ShoppingCart, Loader2, Nfc, Printer } from 'lucide-react';

const Checkout = () => {
    const { state, dispatch } = useCart();
    const router = useRouter();
    const { toast } = useToast();
    const [isScanDialogOpen, setIsScanDialogOpen] = useState(false);
    const [isReceiptDialogOpen, setIsReceiptDialogOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [scannedStudent, setScannedStudent] = useState<Student | null>(null);
    const [lastTransaction, setLastTransaction] = useState<Transaction | null>(null);
    const { user } = useAuth();

    const receiptRef = useRef<HTMLDivElement>(null);
    const handlePrint = useReactToPrint({
      content: () => receiptRef.current,
    });
    
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
                    description: `The scanned ID is not registered. Please use a valid student ID.`,
                });
                setScannedStudent(null);
                return;
            }
            
            toast({
                title: 'Student ID Scanned',
                description: `Authenticated: ${student.name}`,
            });
            setScannedStudent(student);
            setIsScanDialogOpen(false);

        } catch (error) {
            console.error("Error during student scan:", error);
            toast({ variant: 'destructive', title: 'Scan Failed', description: 'Could not validate student ID.' });
        } finally {
            setIsProcessing(false);
        }
    };
    
    const handlePayment = () => {
        if (!scannedStudent) {
             toast({ variant: 'destructive', title: 'Payment Error', description: 'No student ID has been scanned.' });
             return;
        }

        if (scannedStudent.walletBalance < total) {
            toast({
                variant: 'destructive',
                title: 'Insufficient Balance',
                description: `${scannedStudent.name}'s wallet balance is ₹${scannedStudent.walletBalance.toFixed(2)}. Please ask them to recharge.`,
            });
            return;
        }

        // 1. Deduct balance
        updateStudentBalance(scannedStudent.id, scannedStudent.walletBalance - total);

        // 2. Create transaction record
        const newTransaction: Transaction = {
            id: `t${Date.now()}`,
            vendorName: user?.displayName || 'Unknown Vendor',
            date: new Date().toISOString(),
            items: state.items.map(item => ({
                name: item.name,
                quantity: item.quantity,
                price: item.price
            })),
            total: total,
        };
        transactions.unshift(newTransaction);
        setLastTransaction(newTransaction);

        // 3. Notify and clear
        toast({
            title: 'Purchase Successful!',
            description: `₹${total.toFixed(2)} deducted from ${scannedStudent.name}'s wallet.`,
        });

        dispatch({ type: 'CLEAR_CART' });
        setScannedStudent(null);
        setIsReceiptDialogOpen(true);
    };

    return (
        <Card className="glass-card lg:col-span-2 sticky top-24">
            <CardHeader>
                <CardTitle>Point of Sale</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col h-[calc(100%-4rem)]">
                {state.items.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground">
                        <ShoppingCart className="w-16 h-16" />
                        <p className="mt-4 text-lg font-semibold">Cart is Empty</p>
                        <p>Add products from your inventory to start a transaction.</p>
                    </div>
                ) : (
                    <>
                    <ScrollArea className="flex-1 -mx-6">
                        <div className="px-6 divide-y divide-border">
                        {state.items.map(item => (
                            <div key={item.id} className="flex items-start gap-4 py-4">
                            <div className="flex-1">
                                <p className="font-semibold">{item.name}</p>
                                <p className="text-sm text-muted-foreground">₹{item.price.toFixed(2)}</p>
                                <QuantitySelector 
                                    quantity={item.quantity}
                                    onQuantityChange={(newQuantity) => dispatch({ type: 'UPDATE_QUANTITY', payload: { productId: item.id, quantity: newQuantity }})}
                                    max={item.stock}
                                    className="mt-2"
                                />
                            </div>
                            <div className="text-right">
                                <p className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
                                <Button 
                                    variant="ghost" size="icon" className="h-8 w-8 mt-1 text-muted-foreground hover:text-destructive"
                                    onClick={() => dispatch({ type: 'REMOVE_FROM_CART', payload: { productId: item.id } })}
                                    aria-label={`Remove ${item.name}`}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                           
                            </div>
                        ))}
                        </div>
                    </ScrollArea>
                    <div className="mt-auto pt-4 space-y-4">
                        <Separator />
                         <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>₹{subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Taxes & Fees (8%)</span>
                            <span>₹{tax.toFixed(2)}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-bold text-xl">
                            <span>Order Total</span>
                            <span>₹{total.toFixed(2)}</span>
                        </div>
                        <Separator />

                        {scannedStudent && (
                            <div className="p-3 rounded-md bg-green-900/50 border border-green-700 text-center">
                                <p className="font-semibold text-green-300">Student Authenticated</p>
                                <p className="text-lg font-bold">{scannedStudent.name}</p>
                                <p className="text-sm text-muted-foreground">Wallet: ₹{scannedStudent.walletBalance.toFixed(2)}</p>
                            </div>
                        )}

                        <Dialog open={isScanDialogOpen} onOpenChange={setIsScanDialogOpen}>
                            <DialogTrigger asChild>
                                <Button size="lg" className="w-full mt-2" variant="secondary">
                                    <Nfc className="mr-2 h-5 w-5" />
                                    {scannedStudent ? `Scan a Different ID` : `Scan Student ID`}
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="glass-card">
                            <DialogHeader>
                                <DialogTitle>Tap Student ID to Authenticate</DialogTitle>
                                <DialogDescription>Hold the student's ID card near your device to verify their identity for the purchase.</DialogDescription>
                            </DialogHeader>
                            {isProcessing ? (
                                <div className="flex flex-col items-center justify-center gap-4 py-8">
                                <Loader2 className="w-12 h-12 animate-spin text-primary" />
                                <p className="text-muted-foreground">Validating ID...</p>
                                </div>
                            ) : (
                                <NfcScan onScanSuccess={handleScanSuccess} />
                            )}
                            </DialogContent>
                        </Dialog>
                        
                        <Button size="lg" className="w-full" disabled={!scannedStudent} onClick={handlePayment}>
                            Pay ₹{total.toFixed(2)}
                        </Button>
                    </div>
                    </>
                )}
            </CardContent>
             {/* Receipt Dialog */}
            <Dialog open={isReceiptDialogOpen} onOpenChange={setIsReceiptDialogOpen}>
                <DialogContent className="glass-card max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Transaction Complete</DialogTitle>
                        <DialogDescription>A receipt has been generated for this transaction.</DialogDescription>
                    </DialogHeader>
                    <div>
                         <div className="hidden">
                            {lastTransaction && <PrintableReceipt ref={receiptRef} transaction={lastTransaction} />}
                        </div>
                        {lastTransaction && <PrintableReceipt transaction={lastTransaction} />}
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                        <Button variant="outline" onClick={() => setIsReceiptDialogOpen(false)}>Close</Button>
                        <Button onClick={handlePrint}><Printer className="mr-2 h-4 w-4"/> Print Receipt</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </Card>
    );
};

const ProductList = ({ vendorProducts }: { vendorProducts: Product[] }) => {
    const [addedProductId, setAddedProductId] = useState<string | null>(null);
    const { dispatch, state } = useCart();
    const { toast } = useToast();

    const cartItemsMap = useMemo(() => {
        return state.items.reduce((map, item) => {
            map[item.id] = item;
            return map;
        }, {} as Record<string, typeof state.items[0]>);
    }, [state.items]);

    const handleAddToCart = (product: Product) => {
        dispatch({ type: 'ADD_TO_CART', payload: product });
        setAddedProductId(product.id);
        toast({
            title: "Added to cart!",
            description: `${product.name} is now in your cart.`,
        });
        setTimeout(() => setAddedProductId(null), 1500);
    };

    return (
        <Card className="glass-card lg:col-span-3">
            <CardHeader>
                <CardTitle>Product Inventory</CardTitle>
                <CardDescription>Add products to the cart to start a new transaction.</CardDescription>
            </CardHeader>
            <CardContent>
                 <ScrollArea className="h-[60vh]">
                     <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 pr-4">
                        {vendorProducts.map(product => {
                            const cartItem = cartItemsMap[product.id];
                            const availableStock = product.stock - (cartItem?.quantity || 0);
                            const isOutOfStock = availableStock <= 0;
                            const isJustAdded = addedProductId === product.id;

                            return (
                                <Card key={product.id} className="bg-background/50 flex flex-col">
                                    <CardContent className="p-4 flex-1">
                                        <CardTitle className="text-lg font-headline mb-1">{product.name}</CardTitle>
                                        <CardDescription>
                                        <span className="text-base text-primary font-semibold">₹{product.price.toFixed(2)}</span>
                                        <span className="text-sm text-muted-foreground ml-2">({product.stock} in stock)</span>
                                        </CardDescription>
                                    </CardContent>
                                    <CardFooter className="p-3 pt-0">
                                        <Button 
                                            className="w-full" 
                                            disabled={isOutOfStock || isJustAdded} 
                                            onClick={() => handleAddToCart(product)}
                                            variant={isJustAdded ? "secondary" : "default"}
                                            >
                                            {isJustAdded ? (
                                                <><CheckCircle className="mr-2 h-4 w-4"/> Added</>
                                            ) : isOutOfStock ? (
                                                'Out of Stock'
                                            ) : (
                                                <><Plus className="mr-2 h-4 w-4" /> Add to Cart</>
                                            )}
                                        </Button>
                                    </CardFooter>
                                </Card>
                            );
                        })}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
};


export default function VendorDashboardPage() {
  const { user, loading, refreshSession } = useAuth();
  const router = useRouter();

  const vendor = useMemo(() => {
    if (!user || !user.displayName) return null;
    return vendors.find(v => v.name === user.displayName) || null;
  }, [user]);

  const handleSignOut = () => {
    signOut();
    refreshSession();
    router.push('/vendor/login');
  };

  if (loading || !user) {
    return null;
  }
  
  if (!vendor) {
      return (
        <div className="container mx-auto px-4 py-8 text-center">
            <Card className="glass-card max-w-md mx-auto">
                <CardHeader>
                    <CardTitle>Error: Vendor Not Found</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Could not find vendor data for "{user.displayName}". Please ensure you are using the correct login credentials.</p>
                     <Button onClick={handleSignOut} className="mt-4">
                        <LogOut className="mr-2 h-4 w-4" />
                        Return to Login
                    </Button>
                </CardContent>
            </Card>
        </div>
      )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
            <h1 className="text-3xl font-bold font-headline">Vendor POS</h1>
            <p className="text-muted-foreground">Welcome back, {user.displayName}!</p>
        </div>
        <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        <ProductList vendorProducts={vendor.products} />
        <Checkout />
      </div>
    </div>
  );
}
