import { useEffect, useReducer } from "react";
import { effect, stop, ReactiveEffect } from '@vue/reactivity';
import nextTick from "next-tick";

export function useReactiveState<T>(fn: () => T) {
  const [state, dispatch] = useReducer((state: T, action: T) => action || state, fn());
  useEffect(() => {
    let job: ReactiveEffect<T>;
    let ring = false;
    let unmounting = false;
    const scheduler = () => {
      if (ring || unmounting) return;
      ring = true;
      nextTick(() => {
        dispatch(job());
        ring = false;
      });
    }
    const _effect = effect(fn, {
      lazy: true,
      scheduler: getter => {
        job = getter;
        scheduler();
      },
    });
    job = _effect;
    scheduler();
    return () => {
      unmounting = true;
      stop(_effect);
    }
  }, []);
  return state;
}