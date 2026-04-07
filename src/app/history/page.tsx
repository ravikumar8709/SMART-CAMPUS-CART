'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PrintableReceipt from '@/components/printable-receipt';
import { useCart } from '@/contexts/cart-provider';
import type { Transaction } from '@/lib/types';
import { History, Printer, Receipt } from 'lucide-react';
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

export default function HistoryPage() {
  const { state } = useCart();
  const transactions = state.transactions;
  const receiptRefs = useRef<{[key: string]: HTMLDivElement | null}>({});

  const handlePrint = useReactToPrint({
    content: () => {
      // This is a bit of a trick to get the right content to the print library
      // Since we can't pass arguments to the `content` function directly,
      // we'll find the component reference from the button's data attribute.
      // A more robust solution might involve a different architecture if many
      // items needed printing.
      const printButton = document.querySelector('[data-printing="true"]');
      if (printButton) {
        const transactionId = printButton.getAttribute('data-transaction-id');
        if (transactionId) {
          printButton.removeAttribute('data-printing');
          return receiptRefs.current[transactionId];
        }
      }
      return null;
    },
     onBeforeGetContent: () => {
        // Find which button was clicked and mark it.
        // This is a workaround since we cannot pass arguments to the content callback.
        const activeElement = document.activeElement;
        if (activeElement instanceof HTMLButtonElement && activeElement.dataset.transactionId) {
            activeElement.setAttribute('data-printing', 'true');
        }
    },
    onAfterPrint: () => {
        const printButton = document.querySelector('[data-printing="true"]');
        if (printButton) {
            printButton.removeAttribute('data-printing');
        }
    }
  });
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <History className="w-8 h-8 text-primary mr-3" />
        <h1 className="text-3xl font-bold font-headline">Transaction History</h1>
      </div>

      <Card className="glass-card">
        <CardContent className="p-0">
          {transactions.length > 0 ? (
            <Accordion type="single" collapsible className="w-full">
              {transactions.map((transaction: Transaction) => (
                <AccordionItem value={transaction.id} key={transaction.id} className="px-6">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex justify-between items-center w-full">
                      <div className="text-left">
                        <p className="font-semibold text-base">{transaction.vendorName}</p>
                        <p className="text-sm text-muted-foreground">{new Date(transaction.date).toLocaleDateString()}</p>
                      </div>
                      <p className="font-bold text-lg text-primary">₹{transaction.total.toFixed(2)}</p>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="bg-muted/50 -mx-6 px-6 py-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold flex items-center"><Receipt className="w-4 h-4 mr-2"/>Receipt</h4>
                         <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={handlePrint} 
                            data-transaction-id={transaction.id}
                        >
                            <Printer className="w-4 h-4 mr-2" />
                            Print Receipt
                        </Button>
                      </div>
                      
                      {transaction.studentId && (
                        <div className="mb-3 pb-2 border-b text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Student:</span>
                            <span className="font-medium">{transaction.studentName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Student ID:</span>
                            <span className="font-mono text-xs">{transaction.studentId}</span>
                          </div>
                        </div>
                      )}

                      <ul className="space-y-1">
                        {transaction.items.map((item, index) => (
                          <li key={index} className="flex justify-between text-sm">
                            <span>{item.name} x{item.quantity}</span>
                            <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="border-t my-2"></div>
                       <div className="flex justify-between font-semibold text-sm">
                            <span>Total</span>
                            <span>₹{transaction.total.toFixed(2)}</span>
                        </div>
                    </div>
                    {/* Hidden component that will be used for printing */}
                    <div className="hidden">
                        <PrintableReceipt
                          ref={el => (receiptRefs.current[transaction.id] = el)}
                          transaction={transaction}
                        />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="text-center py-16 text-muted-foreground">
              <p>No transactions yet.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
