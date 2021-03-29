import { useEffect, useReducer, useRef } from "react";
import { effect, stop, ReactiveEffect } from '@vue/reactivity';

export function useReactiveState<T>(fn: () => T) {
  const ctx = useRef(false);
  const [state, dispatch] = useReducer((state: T, action: T) => action, fn());
  useEffect(() => {
    const _effect = effect(fn, {
      lazy: true,
      scheduler: (job: ReactiveEffect<T>) => {
        if (ctx.current) return;
        const value = job();
        if (value === undefined) return;
        dispatch(value);
      },
    });
    dispatch(_effect());
    return () => {
      ctx.current = true;
      stop(_effect);
    }
  }, []);
  return state;
}