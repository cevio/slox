import { useEffect, useReducer } from "react";
import { effect, stop, ReactiveEffect } from '@vue/reactivity';

export function useReactiveState<T>(fn: () => T) {
  const [state, dispatch] = useReducer((state: T, action: T) => action, fn());
  useEffect(() => {
    const useSafeDispatch = (job: ReactiveEffect<T>) => {
      const value = job();
      if (value === undefined) return;
      dispatch(value);
    }
    const _effect = effect(fn, {
      lazy: true,
      scheduler: useSafeDispatch,
    });
    useSafeDispatch(_effect);
    return () => stop(_effect);
  }, []);
  return state;
}