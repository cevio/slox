import { useEffect, useReducer } from "react";
import { effect, stop, ReactiveEffect } from '@vue/reactivity';

export function useReactiveState<T>(fn: () => T) {
  const [state, dispatch] = useReducer((state: T, action: T) => action, fn());
  useEffect(() => {
    const _effect = effect(fn, {
      lazy: true,
      scheduler: (job: ReactiveEffect<T>) => dispatch(job()),
    });
    dispatch(_effect());
    return () => stop(_effect);
  }, []);
  return state;
}