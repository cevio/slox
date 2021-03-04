import React, { FunctionComponent, useMemo } from 'react';
import { AnnotationDependenciesAutoRegister, ClassMetaCreator } from "../annotates";
import { TComponent } from "./component";
import { container } from '..';
import { TRequest } from '../request';

export function Middleware(component: TComponent | FunctionComponent<TRequest>) {
  let isIOComponent = false;
  if (component.prototype && component.prototype.render) {
    AnnotationDependenciesAutoRegister(component as TComponent, container);
    isIOComponent = true;
  }
  return ClassMetaCreator.unshift(Middleware.namespace, isIOComponent ? (props: React.PropsWithChildren<TRequest>) => {
    const target = useMemo(() => container.get(component), [component]);
    return React.createElement(target.render.bind(target), props, props.children);
  } : component);
}

Middleware.namespace = Symbol('MIDDLEWARE');