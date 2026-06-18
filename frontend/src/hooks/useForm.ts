'use client';

import {
  useState,
  useCallback,
  useMemo,
  type ChangeEvent,
  type FocusEvent,
  type FormEvent,
} from 'react';
import { z } from 'zod';

export function useForm<T extends Record<string, unknown>>({
  schema,
  initialValues,
  onSubmit,
}: {
  schema: z.ZodSchema<T>;
  initialValues: T;
  onSubmit: (values: T) => Promise<void>;
}) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = useCallback(
    (vals: T): Record<string, string> => {
      const result = schema.safeParse(vals);
      if (result.success) return {};
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        const field = String(err.path[0] ?? '');
        if (field && !fieldErrors[field]) fieldErrors[field] = err.message;
      });
      return fieldErrors;
    },
    [schema]
  );

  const isValid = useMemo(
    () => Object.keys(validate(values)).length === 0,
    [validate, values]
  );

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      const next = { ...values, [name]: value } as T;
      setValues(next);
      if (touched[name]) {
        const errs = validate(next);
        setErrors((prev) => ({ ...prev, [name]: errs[name] ?? '' }));
      }
    },
    [values, touched, validate]
  );

  const handleBlur = useCallback(
    (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name } = e.target;
      setTouched((prev) => ({ ...prev, [name]: true }));
      const errs = validate(values);
      setErrors((prev) => ({ ...prev, [name]: errs[name] ?? '' }));
    },
    [values, validate]
  );

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const allTouched = Object.keys(values).reduce<Record<string, boolean>>(
        (acc, k) => ({ ...acc, [k]: true }),
        {}
      );
      setTouched(allTouched);
      const errs = validate(values);
      if (Object.keys(errs).length > 0) {
        setErrors(errs);
        return;
      }
      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, validate, onSubmit]
  );

  const setFieldValue = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  }, []);

  const setFieldError = useCallback((field: string, error: string) => {
    setErrors((prev) => ({ ...prev, [field]: error }));
  }, []);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldError,
    reset,
  };
}
