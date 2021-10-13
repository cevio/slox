import React from 'react';
import { AnnotationDependenciesAutoRegister } from '../annotates/metaDataScaner';
import { container } from '../index';
import { useComponentWithClass, isIocComponent } from '../decorators/component';
import { TClassComponent, TComponent, TSloxComponent } from '../interface';

type TViteLoaders = Record<string, () => Promise<{
  [key: string]: any;
}>>

export function importLoadersWithVite(
  loaders: TViteLoaders, 
  getLoader: (key: string) => {
    namespace: string,
    loader: Parameters<typeof React.lazy>[0],
  }
) {
  const components: Record<string, React.LazyExoticComponent<React.ComponentType<any>>> = {};
  for (const key in loaders) {
    const { namespace, loader } = getLoader(key);
    type TLoader = typeof loader;
    components[namespace] = React.lazy(((loader: TLoader) => {
      return async () => {
        const res = await loader();
        const component = res.default as TSloxComponent<any, any>;
        const isioc = isIocComponent(res.default as TClassComponent<any, any>);
        if (isioc) AnnotationDependenciesAutoRegister(component as TClassComponent<any, any>, container);
        return {
          default: isioc
            ? useComponentWithClass(component as TClassComponent<any, any>)
            : component as TComponent<any, any>
        }
      }
    })(loader));
  }
  return components;
}