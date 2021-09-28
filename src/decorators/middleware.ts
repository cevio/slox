import { AnnotationDependenciesAutoRegister, ClassMetaCreator } from "../annotates";
import { useComponent } from '../decorators';
import { isIocComponent } from './component';
import { container } from '..';
import { TComponent, TSloxComponent, GetSloxProps } from '../interface';

export function Middleware<T>(component: TSloxComponent<T>, options?: GetSloxProps<TSloxComponent<T>>) {
  const isIoc = isIocComponent(component as TComponent);
  if (isIoc) AnnotationDependenciesAutoRegister(component as TComponent, container);
  return ClassMetaCreator.unshift(
    Middleware.namespace, 
    isIoc 
      ? { middleware: useComponent(component as TComponent), props: options } 
      : { middleware: component, props: options }
  );
}

Middleware.namespace = Symbol('MIDDLEWARE');