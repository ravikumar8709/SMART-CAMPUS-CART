import type { Vendor, Transaction, Product } from './types';

export const ADMIN_EMAIL = 'admin@campustcart.com';

export const vendors: Vendor[] = [
  {
    id: '1',
    name: 'Bombay Chaatwala',
    description: 'Authentic Indian street food, bursting with flavor. A campus favorite for a spicy kick!',
    products: [
      { id: '101', name: 'Vegetable Samosa', price: 2.25, stock: 60 },
      { id: '102', name: 'Pani Puri', price: 5.00, stock: 40 },
      { id: '103', name: 'Mango Lassi', price: 4.50, stock: 35 },
      { id: '104', name: 'Chai Tea', price: 2.50, stock: 50 },
    ],
  },
  {
    id: '2',
    name: 'Lee Corner',
    description: 'Your campus convenience store for quick bites, drinks, and study essentials.',
    products: [
      { id: '201', name: 'Energy Drink', price: 3.50, stock: 100 },
      { id: '202', name: 'Protein Bar', price: 2.75, stock: 80 },
      { id: '203', name: 'Bag of Chips', price: 1.50, stock: 120 },
      { id: '204', name: 'Instant Noodles', price: 2.00, stock: 90 },
    ],
  },
  {
    id: '3',
    name: 'Samosa Spot',
    description: 'Authentic, flavorful samosas and Indian street food. A campus favorite!',
    products: [
      { id: '301', name: 'Vegetable Samosa', price: 2.00, stock: 75 },
      { id: '302', name: 'Chicken Samosa', price: 2.50, stock: 50 },
      { id: '303', name: 'Mango Lassi', price: 4.00, stock: 30 },
      { id: '304', name: 'Chai Tea', price: 2.50, stock: 45 },
    ],
  },
  {
    id: '4',
    name: 'Fruit Shop',
    description: 'Fresh and juicy fruits, smoothies, and healthy juices.',
    products: [
      { id: '401', name: 'Banana', price: 0.50, stock: 150 },
      { id: '402', name: 'Orange Juice', price: 3.50, stock: 50 },
      { id: '403', name: 'Fruit Salad', price: 5.00, stock: 30 },
      { id: '404', name: 'Berry Smoothie', price: 6.00, stock: 25 },
    ],
  },
];

// This is now a `let` to allow it to be mutated (new transactions added).
export let transactions: Transaction[] = [];

export const user = {
    name: 'Alex Doe',
    email: 'alex.doe@university.edu',
}
