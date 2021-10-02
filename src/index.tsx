import React from 'react';
import ReactDOM from 'react-dom';
import { Root } from './root';
import { Container } from 'inversify';
import { Router } from './router';
import { createHistory, History, THistory } from './history';
import { redirect, replace, useLocation, useQuery, useParam } from './request';
import { Controller, isIocComponent, Middleware, useComponentWithClass } from './decorators';
import { AnnotationDependenciesAutoRegister, AnnotationMetaDataScan } from './annotates';
import { TComponent, TSloxComponent, GetSloxProps, TMiddlewareState, TClassComponent } from './interface';

export * from 'inversify';
export * from '@vue/reactivity';
export * from './interface';
export * from './annotates';
export * from './decorators';
export * from './state';
export * from './promise';
export {
  redirect, 
  replace,
  useLocation,
  useQuery,
  useParam,
}

const router = new Router({
  maxParamLength: Infinity,
  ignoreTrailingSlash: true,
  caseSensitive: true,
});


export const container = new Container();
export function createServer() {
  if (History.mode) throw new Error('you have already bootstrap the app!');

  const globalMiddlewares: TMiddlewareState<any, any>[] = [];
  const controllers: Set<TClassComponent<any, any>> = new Set();

  function useGlobalMiddlewares<T, O>(m: TSloxComponent<T, O>, p?: GetSloxProps<TSloxComponent<T, O>, O>) {
    const isIoc = isIocComponent(m as TClassComponent<T, O>);
    if (isIoc) {
      AnnotationDependenciesAutoRegister(m as TClassComponent<T, O>, container);
    }
    globalMiddlewares.push({
      middleware: isIoc ? useComponentWithClass(m as TClassComponent<T, O>) : m as TComponent<T, O>,
      props: p
    });
  }

  const defineController = (...controls: TClassComponent<any, any>[]) => {
    controls.forEach(control => {
      AnnotationDependenciesAutoRegister(control, container);
      controllers.add(control);
    });
  }

  const createNotFoundComponent = (component: THistory['notFoundComponent']) => History.notFoundComponent = component;
  const bootstrap = <E extends HTMLElement = HTMLElement>(mode: Parameters<typeof createHistory>[1], el: E) => {
    const setup = (set: React.Dispatch<React.SetStateAction<TMiddlewareState<any, any>[]>>) => {
      buildControllers(set);
      const subscribe = createHistory(router, mode, set);
      return subscribe();
    }
    ReactDOM.render(<Root bootstrap={setup} />, el);
  }

  const buildControllers = (set: React.Dispatch<React.SetStateAction<TMiddlewareState<any, any>[]>>) => {
    const cache = new Map<any, any>();
    controllers.forEach(component => {
      const meta = AnnotationMetaDataScan(component, container);
      const controller = meta.meta.get<string>(Controller.namespace);
      if (!controller) return;
      const controllerMiddlewares = meta.meta.got<TMiddlewareState<any, any>[]>(Middleware.namespace, []);
      const middlewares: TMiddlewareState<any, any>[] = globalMiddlewares.concat(controllerMiddlewares).map(middleware => {
        if (!cache.has(middleware.middleware)) {
          cache.set(middleware.middleware, React.memo(middleware.middleware))
        }
        const cmp = cache.get(middleware.middleware);
        return {
          middleware: cmp,
          props: middleware.props,
        }
      });
      middlewares.push({ middleware: useComponentWithClass(component) });
      router.on(controller, () => set(middlewares));
    });
  }

  return {
    bootstrap,
    createNotFoundComponent,
    useGlobalMiddlewares,
    defineController,
  }
}