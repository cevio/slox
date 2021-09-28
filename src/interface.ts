import { FunctionComponent, NamedExoticComponent } from 'react';
import { interfaces } from 'inversify';

export type TComponent<T = {}> = interfaces.Newable<{
  render: React.FunctionComponent<T>,
}>
export type TSloxComponent<T> = TComponent<T> | FunctionComponent<T> | NamedExoticComponent<T>;
export type GetSloxProps<T> = T extends TSloxComponent<infer R> ? R : any;

export interface TMiddlewareState<T> {
  middleware: React.FunctionComponent<T> | NamedExoticComponent<T>,
  props?: GetSloxProps<React.FunctionComponent<T>>
}