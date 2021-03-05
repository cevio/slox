import { FunctionComponent } from 'react';
import { AnnotationDependenciesAutoRegister, ClassMetaCreator } from "../annotates";
import { useComponent } from '../decorators';
import { TComponent } from "./component";
import { container } from '..';

export function Middleware(component: TComponent | FunctionComponent) {
  let isIOComponent = false;
  if (component.prototype && component.prototype.render) {
    AnnotationDependenciesAutoRegister(component as TComponent, container);
    isIOComponent = true;
  }
  return ClassMetaCreator.unshift(
    Middleware.namespace, 
    isIOComponent ? useComponent(component as TComponent) : component
  );
}

Middleware.namespace = Symbol('MIDDLEWARE');