import React from 'react';
import { MethodMetaCreator } from '../annotates';
import { WrapNamespace } from './component';
type TMemo = Parameters<typeof React.memo>[1];
export function Memo<T>(callback?: TMemo): MethodDecorator {
  return MethodMetaCreator.define(WrapNamespace, (fn: React.FunctionComponent<T>) => React.memo(fn, callback));
}