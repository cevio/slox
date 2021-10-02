import React from 'react';
import { MethodMetaCreator } from '../annotates';
import { WrapNamespace } from './component';
export function ForwardRef<T>(): MethodDecorator {
  return MethodMetaCreator.define(WrapNamespace, (fn: React.ForwardRefRenderFunction<T>) => React.forwardRef(fn));
}