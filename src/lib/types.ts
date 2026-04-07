import { z } from 'zod';

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

export interface Vendor {
  id: string;
  name: string;
  description: string;
  products: Product[];
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Transaction {
  id: string;
  vendorName: string;
  date: string;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  studentId?: string;
  studentName?: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
}

// Types for the student profile flow
export const StudentProfileInputSchema = z.string().describe('The student registration ID.');
export type StudentProfileInput = z.infer<typeof StudentProfileInputSchema>;

export const StudentProfileOutputSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
}).nullable();
export type StudentProfileOutput = z.infer<typeof StudentProfileOutputSchema>;
