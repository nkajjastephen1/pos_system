import { Product, Transaction } from '../types';
export const MOCK_PRODUCTS: Product[] = [
// Electronics
{
  id: '1',
  name: 'MacBook Pro 14"',
  sku: 'ELEC-001',
  cost: 1500.0,
  price: 1999.0,
  stock: 15,
  category: 'electronics'
}, {
  id: '2',
  name: 'iPhone 15 Pro',
  sku: 'ELEC-002',
  cost: 800.0,
  price: 999.0,
  stock: 25,
  category: 'electronics'
}, {
  id: '3',
  name: 'Sony WH-1000XM5',
  sku: 'ELEC-003',
  cost: 250.0,
  price: 348.0,
  stock: 40,
  category: 'electronics'
}, {
  id: '4',
  name: 'iPad Air 5',
  sku: 'ELEC-004',
  cost: 500.0,
  price: 599.0,
  stock: 20,
  category: 'electronics'
}, {
  id: '5',
  name: 'Apple Watch S9',
  sku: 'ELEC-005',
  cost: 399.0,
  price: 399.0,
  stock: 30,
  category: 'electronics'
},
// Clothing
{
  id: '6',
  name: 'Cotton T-Shirt',
  sku: 'CLTH-001',
  cost: 10.0,
  price: 25.0,
  stock: 100,
  category: 'clothing'
}, {
  id: '7',
  name: 'Slim Fit Jeans',
  sku: 'CLTH-002',
  cost: 15.0,
  price: 65.0,
  stock: 50,
  category: 'clothing'
}, {
  id: '8',
  name: 'Denim Jacket',
  sku: 'CLTH-003',
  cost: 30.0,
  price: 85.0,
  stock: 35,
  category: 'clothing'
}, {
  id: '9',
  name: 'Running Sneakers',
  sku: 'CLTH-004',
  cost: 40.0,
  price: 120.0,
  stock: 45,
  category: 'clothing'
}, {
  id: '10',
  name: 'Baseball Cap',
  sku: 'CLTH-005',
  cost: 8.0,
  price: 20.0,
  stock: 80,
  category: 'clothing'
},
// Food
{
  id: '11',
  name: 'Artisan Coffee',
  sku: 'FOOD-001',
  cost: 2.0,
  price: 4.5,
  stock: 200,
  category: 'food'
}, {
  id: '12',
  name: 'Club Sandwich',
  sku: 'FOOD-002',
  cost: 5.0,
  price: 12.0,
  stock: 50,
  category: 'food'
}, {
  id: '13',
  name: 'Caesar Salad',
  sku: 'FOOD-003',
  cost: 4.0,
  price: 10.0,
  stock: 40,
  category: 'food'
}, {
  id: '14',
  name: 'Fresh Juice',
  sku: 'FOOD-004',
  cost: 3.0,
  price: 6.0,
  stock: 60,
  category: 'food'
}, {
  id: '15',
  name: 'Protein Bar',
  sku: 'FOOD-005',
  cost: 1.5,
  price: 3.0,
  stock: 150,
  category: 'food'
},
// Home
{
  id: '16',
  name: 'Desk Lamp',
  sku: 'HOME-001',
  price: 45.0,
  cost: 20.0,
  stock: 25,
  category: 'home'
}, {
  id: '17',
  name: 'Throw Pillow',
  sku: 'HOME-002',
  cost: 10.0,
  price: 25.0,
  stock: 40,
  category: 'home'
}, {
  id: '18',
  name: 'Fleece Blanket',
  sku: 'HOME-003',
  cost: 15.0,
  price: 35.0,
  stock: 30,
  category: 'home'
}, {
  id: '19',
  name: 'Ceramic Mug',
  sku: 'HOME-004',
  cost: 5.0,
  price: 15.0,
  stock: 60,
  category: 'home'
}, {
  id: '20',
  name: 'Succulent Plant',
  sku: 'HOME-005',
  cost: 7.0,
  price: 12.0,
  stock: 45,
  category: 'home'
},
// Other
{
  id: '21',
  name: 'Moleskine Notebook',
  sku: 'OTHR-001',
  cost: 10.0,
  price: 22.0,
  stock: 55,
  category: 'other'
}, {
  id: '22',
  name: 'Pen Set',
  sku: 'OTHR-002',
  cost: 5.0,
  price: 15.0,
  stock: 70,
  category: 'other'
}, {
  id: '23',
  name: 'Travel Backpack',
  sku: 'OTHR-003',
  cost: 50.0,
  price: 85.0,
  stock: 20,
  category: 'other'
}, {
  id: '24',
  name: 'Water Bottle',
  sku: 'OTHR-004',
  cost: 12.0,
  price: 28.0,
  stock: 40,
  category: 'other'
}, {
  id: '25',
  name: 'Sunglasses',
  sku: 'OTHR-005',
  cost: 75.0,
  price: 150.0,
  stock: 25,
  category: 'other'
}];
export const MOCK_TRANSACTIONS: Transaction[] = [{
  id: 'TRX-1001',
  items: [{
    product: MOCK_PRODUCTS[0],
    quantity: 1
  }, {
    product: MOCK_PRODUCTS[5],
    quantity: 2
  }],
  subtotal: 2049.0,
  tax: 0,
  total: 2049.0,
  paymentMethod: 'card',
  amountPaid: 2049.0,
  change: 0,
  date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() // 2 hours ago
}, {
  id: 'TRX-1002',
  items: [{
    product: MOCK_PRODUCTS[10],
    quantity: 2
  }, {
    product: MOCK_PRODUCTS[11],
    quantity: 1
  }],
  subtotal: 21.0,
  tax: 0,
  total: 21.0,
  paymentMethod: 'cash',
  amountPaid: 25.0,
  change: 4.0,
  date: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() // 5 hours ago
}
// Add more transactions as needed for testing
];