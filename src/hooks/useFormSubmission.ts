import { useState, useCallback } from 'react';

type SubmitFn<T, R> = (data: T) => Promise<R>;

type UseFormSubmissionOptions<R> = {
  onSuccess?: (result: R) => void;
  onError?: (error: Error) => void;
};

type UseFormSubmissionResult<T, R> = {
  isSubmitting: boolean;
  error: Error | null;
  result: R | null;
  submit: (data: T) => Promise<R | null>;
  reset: () => void;
};

export function useFormSubmission<T, R>(
  submitFn: SubmitFn<T, R>,
  options: UseFormSubmissionOptions<R> = {}
): UseFormSubmissionResult<T, R> {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [result, setResult] = useState<R | null>(null);

  const submit = useCallback(
    async (data: T): Promise<R | null> => {
      setIsSubmitting(true);
      setError(null);
      
      try {
        const res = await submitFn(data);
        setResult(res);
        options.onSuccess?.(res);
        return res;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        options.onError?.(error);
        return null;
      } finally {
        setIsSubmitting(false);
      }
    },
    [submitFn, options]
  );

  const reset = useCallback(() => {
    setIsSubmitting(false);
    setError(null);
    setResult(null);
  }, []);

  return {
    isSubmitting,
    error,
    result,
    submit,
    reset,
  };
}

export default useFormSubmission;
