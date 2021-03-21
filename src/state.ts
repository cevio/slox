import { useEffect, useReducer } from "react";
import { effect, stop, ReactiveEffect } from '@vue/reactivity';
import nextTick from "next-tick";

export function useReactiveState<T>(fn: () => T) {
  const [state, dispatch] = useReducer((state: T, action: T) => action || state, fn());
  useEffect(() => {
    let job: ReactiveEffect<T>;
    let ring = false;
    let unmounting = false;
    const scheduler = (ob: ReactiveEffect<T>) => {
      job = ob;
      if (ring) return;
      ring = true;
      nextTick(() => {
        if (!unmounting) {
          dispatch(job());
        }
        ring = false;
      });
    }
    const _effect = effect(fn, {
      lazy: true,
      scheduler,
    });
    scheduler(_effect);
    return () => {
      unmounting = true;
      stop(_effect);
    }
  }, []);
  return state;
}