// hooks/useCustomers.ts
import { useMutation } from '@tanstack/react-query';
import { CustomerFormData } from '@/types';

async function createCustomer(customerData: CustomerFormData) {
  const res = await fetch('/api/accurate/customer/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(customerData),
  });
  if (!res.ok) throw new Error('Failed to create customer');
  return res.json();
}

export function useCreateCustomer() {
  return useMutation({
    mutationFn: createCustomer,
  });
}