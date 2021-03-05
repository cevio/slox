import React, { useMemo } from 'react';
import { ClassMetaCreator } from '../annotates';
import { injectable, interfaces } from 'inversify';
import { container } from '..';

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

export type TComponent = interfaces.Newable<{
  render: React.FunctionComponent
}>

export function useComponent(component: TComponent) {
  const target = container.get(component);
  return target.render.bind(target);
}