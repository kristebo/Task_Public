import { useCallback, useState } from 'react';

export interface FormState<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  dirty: boolean;
  valid: boolean;
  set<K extends keyof T>(key: K, value: T[K]): void;
  reset(next?: T): void;
}

export function useForm<T extends Record<string, unknown>>(
  initial: T,
  validate?: (values: T) => Partial<Record<keyof T, string>>,
): FormState<T> {
  const [values, setValues] = useState<T>(initial);
  const [dirty, setDirty] = useState(false);

  const errors = validate ? validate(values) : {};
  const valid = Object.keys(errors).length === 0;

  const set = useCallback(<K extends keyof T>(key: K, value: T[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setDirty(true);
  }, []);

  const reset = useCallback(
    (next?: T) => {
      setValues(next ?? initial);
      setDirty(false);
    },
    [initial],
  );

  return { values, errors, dirty, valid, set, reset };
}
