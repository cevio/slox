import { AnnotationDependenciesAutoRegister, ClassMetaCreator } from "../annotates";
import { useComponentWithClass } from '../decorators';
import { isIocComponent } from './component';
import { container, TClassComponent } from '..';
import { TSloxComponent, GetSloxProps } from '../interface';

export function Middleware<T, O>(component: TSloxComponent<T, O>, options?: GetSloxProps<TSloxComponent<T, O>, O>) {
  const isIoc = isIocComponent(component as TClassComponent<T, O>);
  if (isIoc) AnnotationDependenciesAutoRegister(component as TClassComponent<T, O>, container);
  return ClassMetaCreator.unshift(
    Middleware.namespace, 
    isIoc 
      ? { 
          middleware: isIoc 
            ? useComponentWithClass(component as TClassComponent<T, O>) 
            : component, 
          props: options 
        } 
      : { middleware: component, props: options }
  );
}

Middleware.namespace = Symbol('MIDDLEWARE');