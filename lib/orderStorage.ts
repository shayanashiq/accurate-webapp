// lib/orderStorage.ts
import fs from 'fs';
import path from 'path';

const STORAGE_PATH = path.join(process.cwd(), 'data', 'pending-orders.json');

// Ensure data directory exists
if (!fs.existsSync(path.join(process.cwd(), 'data'))) {
  fs.mkdirSync(path.join(process.cwd(), 'data'));
}

export function savePendingOrder(orderId: string, orderData: any) {
  let orders: any = {};
  
  try {
    if (fs.existsSync(STORAGE_PATH)) {
      orders = JSON.parse(fs.readFileSync(STORAGE_PATH, 'utf-8'));
    }
  } catch (error) {
    console.error('Error reading orders file:', error);
  }

  orders[orderId] = orderData;
  
  fs.writeFileSync(STORAGE_PATH, JSON.stringify(orders, null, 2));
  console.log('💾 Saved pending order:', orderId);
}

export function getPendingOrder(orderId: string) {
  try {
    if (fs.existsSync(STORAGE_PATH)) {
      const orders = JSON.parse(fs.readFileSync(STORAGE_PATH, 'utf-8'));
      return orders[orderId] || null;
    }
  } catch (error) {
    console.error('Error reading order:', error);
  }
  return null;
}

export function deletePendingOrder(orderId: string) {
  try {
    if (fs.existsSync(STORAGE_PATH)) {
      const orders = JSON.parse(fs.readFileSync(STORAGE_PATH, 'utf-8'));
      delete orders[orderId];
      fs.writeFileSync(STORAGE_PATH, JSON.stringify(orders, null, 2));
      console.log('🗑️  Deleted pending order:', orderId);
    }
  } catch (error) {
    console.error('Error deleting order:', error);
  }
}