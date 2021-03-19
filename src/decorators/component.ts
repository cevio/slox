import React from 'react';
import { ClassMetaCreator } from '../annotates';
import { injectable, interfaces } from 'inversify';
import { container } from '..';

const placeholder = Symbol('React.FunctionComponent.Cached.Placeholder');

export function Component() {
  return ClassMetaCreator.join(
    ClassMetaCreator.define(Component.namespace, true),
    injectable()
  )
}

export function Service() {
  return ClassMetaCreator.join(
    ClassMetaCreator.define(Service.namespace, true),
    injectable()
  )
}

Component.namespace = Symbol('COMPONENT');
Service.namespace = Symbol('SERVICE');

export type TComponent<T = {}> = interfaces.Newable<{
  render: React.FunctionComponent<T>
}>

export function useComponent<T, C = any>(component: TComponent<T> | { render: React.FunctionComponent<T> } | React.FunctionComponent<T>, ctx?: C): React.FunctionComponent<T> {
  if (typeof component === 'function') {
    if (component.prototype && component.prototype.render) {
      const context = container.get(component);
      return componentBindContext(context.render, context);
    } else if (typeof ctx === 'object') {
      return componentBindContext(component as React.FunctionComponent, ctx);
    }
  } else if (typeof component === 'object' && component.render) {
    return componentBindContext(component.render, component);
  }
  throw new Error('useComponent argument must be a class or object or react.functioncomponent');
}

function componentBindContext<T, C>(fn: React.FunctionComponent<T>, context: C): React.FunctionComponent<T> {
  // @ts-ignore
  if (!fn[placeholder]) {
    // @ts-ignore
    fn[placeholder] = fn.bind(context);
  }
  // @ts-ignore
  return fn[placeholder];
}