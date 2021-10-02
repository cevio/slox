import React from 'react';
import { interfaces } from 'inversify';

export type TComponent<T, O> = React.FunctionComponent<T> | React.ForwardRefRenderFunction<O, T>;
export type TClassComponent<T, O> = interfaces.Newable<{
  render: TComponent<T, O>
}>

export type TSloxComponent<T, O> = TClassComponent<T, O> | TComponent<T, O>;
export type GetSloxProps<T, O> = T extends TSloxComponent<infer R, O> ? R : any;

export interface TMiddlewareState<T, O> {
  middleware: TComponent<T, O>,
  props?: GetSloxProps<React.FunctionComponent<T>, O>
}