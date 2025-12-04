// components/Elements/FormFieldInput.tsx
'use client';

import { ControllerRenderProps, FieldValues } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface FormFieldInputProps {
  control: any;
  name: string;
  label: string;
  placeholder?: string;
  description?: string;
  type?: string;
}

export function FormFieldInput({
  control,
  name,
  label,
  placeholder,
  description,
  type = 'text',
}: FormFieldInputProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({
        field,
      }: {
        field: ControllerRenderProps<FieldValues, string>;
      }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input type={type} placeholder={placeholder} {...field} />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
