import { FunctionComponent } from 'react';
import { AnnotationDependenciesAutoRegister, ClassMetaCreator } from "../annotates";
import { useComponent } from '../decorators';
import { TComponent } from "./component";
import { isIocComponent } from './component';
import { container } from '..';

export function Middleware(component: TComponent | FunctionComponent) {
  const isIoc = isIocComponent(component as TComponent);
  if (isIoc) AnnotationDependenciesAutoRegister(component as TComponent, container);
  return ClassMetaCreator.unshift(
    Middleware.namespace, 
    isIoc ? useComponent(component as TComponent) : component
  );
}

Middleware.namespace = Symbol('MIDDLEWARE');

