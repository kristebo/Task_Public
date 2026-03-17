import { NewEmployeeInput } from '../lib/api';

import { useForm } from './useForm';

export function useEmployeeForm() {
  return useForm<NewEmployeeInput>(
    { firstName: '', lastName: '', email: '', department: '', title: '' },
    (v) => {
      const errors: Partial<Record<keyof NewEmployeeInput, string>> = {};
      if (!v.firstName.trim()) errors.firstName = 'First name is required';
      if (!v.lastName.trim()) errors.lastName = 'Last name is required';
      if (!v.email.trim()) {
        errors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) {
        errors.email = 'Invalid email format';
      }
      return errors;
    },
  );
}
