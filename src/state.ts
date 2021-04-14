import { useEffect, useReducer } from "react";
import { effect, stop, ReactiveEffect } from '@vue/reactivity';

export function useReactiveState<T>(fn: () => T) {
  const [state, dispatch] = useReducer((state: T, action: T) => action, fn());
  useEffect(() => {
    let unmounted = false;
    const useSafeDispatch = (job: ReactiveEffect<T>) => {
      if (unmounted) return;
      const value = job();
      if (value === undefined) return;
      dispatch(value);
    }
    const _effect = effect(fn, {
      lazy: true,
      scheduler: useSafeDispatch,
    });
    useSafeDispatch(_effect);
    return () => {
      unmounted = true;
      stop(_effect);
    };
  }, []);
  return state;
}