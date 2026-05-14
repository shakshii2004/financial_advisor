import React from 'react';
import { useController } from 'react-hook-form';
import { Input } from './Input';
import type { InputProps } from './Input';

interface FormInputProps extends Omit<InputProps, 'name'> {
  name: string;
  control: any;
  rules?: any;
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ control, name, rules, ...props }, ref) => {
    const { field, fieldState } = useController({
      control,
      name,
      rules,
    });

    return (
      <Input
        {...props}
        {...field}
        ref={ref}
        error={fieldState.error?.message}
      />
    );
  }
);

FormInput.displayName = 'FormInput';
