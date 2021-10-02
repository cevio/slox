import React from 'react';
import { ClassMetaCreator, MethodMetaCreator } from '../annotates';
import { injectable } from 'inversify';
import { container, TClassComponent } from '..';
import { TComponent } from '../interface';

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

export const WrapNamespace = Symbol('WRAP');

export function useComponentWithClass<T, O>(component: TClassComponent<T, O>) {
  if (!isIocComponent(component) || !component.prototype || !component.prototype.render) throw new Error('component must be a IOC classify object.');
  const context = container.get(component);
  return componentBindContext(context.render, context);
}

export function useComponentWithMethod<T, C, O>(component: TComponent<T, O>, context: C) {
  return componentBindContext(component, context);
}

export function useComponent<T, O>(component: {
  render: TComponent<T, O>
}) {
  if (!component.render) throw new Error('component must be a IOC classify constructor.')
  return componentBindContext(component.render, component);
}

export function isIocComponent<T, O>(component: TClassComponent<T, O>) {
  let isIOComponent = false;
  if (component.prototype && component.prototype.render) {
    isIOComponent = true;
  }
  return isIOComponent;
}

function componentBindContext<T, C, O>(fn: TComponent<T, O>, context: C): O extends HTMLElement ? React.ForwardRefExoticComponent<T & React.RefAttributes<O>> : React.FunctionComponent<T> {
  // @ts-ignore
  if (!fn[placeholder]) {
    // @ts-ignore
    fn[placeholder] = fn.bind(context);
    const proto = context.constructor.prototype;
    const instance = MethodMetaCreator.instance(Object.getOwnPropertyDescriptor(proto, fn.name));
    if (instance.has(WrapNamespace)) {
      const wraper = instance.get(WrapNamespace);
      // @ts-ignore
      fn[placeholder] = wraper(fn[placeholder]);
    }
  }
  // @ts-ignore
  return fn[placeholder];
}