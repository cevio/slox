import { useEffect, useReducer } from "react";

type TUnMounted = ReturnType<Parameters<typeof useEffect>[0]>;

export function usePromise<T>(
  fn: (resolve: (value: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => TUnMounted, 
  initialState: T, 
  deps?: Parameters<typeof useEffect>[1]
): [boolean, T, any] {
  const [loading, setLoading] = useReducer((state: boolean, action: boolean) => action, false);
  const [result, setResult] = useReducer((state: T, action: T) => action, initialState);
  const [error, setError] = useReducer((state: any, action: any) => action, null);
  useEffect(() => {
    let cancel: TUnMounted, unmounted = false;
    setLoading(true);
    const promise = new Promise<T>((resolve, reject) => cancel = fn(resolve, reject));
    promise.then(v => {
      if (!unmounted) {
        setResult(v);
      }
    }).catch(e => {
      if (!unmounted) {
        setError(e);
      }
    }).finally(() => {
      if (!unmounted) {
        setLoading(false);
      }
    });
    return () => {
      unmounted = true;
      // @ts-ignore
      cancel();
    };
  }, deps);
  return [loading, result, error];
}