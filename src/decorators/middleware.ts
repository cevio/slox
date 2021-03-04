import React, { useMemo } from 'react';
import { AnnotationDependenciesAutoRegister, ClassMetaCreator } from "../annotates";
import { TComponent } from "./component";
import { container } from '..';
import { TRequest } from '../request';

export function Middleware(component: TComponent) {
  AnnotationDependenciesAutoRegister(component, container);
  return ClassMetaCreator.unshift(Middleware.namespace, (props: React.PropsWithChildren<TRequest>) => {
    const target = useMemo(() => container.get(component), [component]);
    return React.createElement(target.render.bind(target), props, props.children);
  });
}

Middleware.namespace = Symbol('MIDDLEWARE');