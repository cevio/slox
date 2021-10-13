import React from 'react';
import { AnnotationDependenciesAutoRegister, TClassIndefiner } from '../annotates/metaDataScaner';
import { container } from '../index';
import { useComponentWithClass } from '../decorators/component';

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
        AnnotationDependenciesAutoRegister(res.default as TClassIndefiner<any>, container);
        return {
          default: useComponentWithClass(res.default as TClassIndefiner<any>),
        }
      }
    })(loader));
  }
}