import React from 'react';
import ReactDOM from 'react-dom';
import { Root, createCachedMiddlewareComponent, setPage, setMiddlewares } from './root';
import { Container } from 'inversify';
import { Router } from './router';
import { createHistory, History, THistory } from './history';
import { redirect, replace, useLocation, useQuery, useParam } from './request';
import { Controller, isIocComponent, Middleware, TComponent, useComponent } from './decorators';
import { AnnotationDependenciesAutoRegister, AnnotationMetaDataScan } from './annotates';

export * from 'inversify';
export * from '@vue/reactivity';

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

  const globalMiddlewares: React.FunctionComponent[] = [];
  const controllers: Set<TComponent> = new Set();

  const useGlobalMiddlewares = (...mids: Parameters<typeof Middleware>[0][]) => {
    globalMiddlewares.push(...mids.map(m => {
      if (isIocComponent(m as TComponent)) {
        AnnotationDependenciesAutoRegister(m as TComponent, container);
      }
      return useComponent(m);
    }));
  }

  const defineController = (...controls: TComponent[]) => {
    controls.forEach(control => {
      AnnotationDependenciesAutoRegister(control, container);
      controllers.add(control);
    });
  }

  let middlewareSetup = false;
  const allowMiddlewareSize = (i: number) => {
    for (let j = 0; j < i; j++) {
      createCachedMiddlewareComponent();
    }
    middlewareSetup = true;
  }
  const createNotFoundComponent = (component: THistory['notFoundComponent']) => History.notFoundComponent = component;
  const bootstrap = <E extends HTMLElement = HTMLElement>(mode: Parameters<typeof createHistory>[1], el: E) => {
    buildControllers();
    if (!middlewareSetup) allowMiddlewareSize(1);
    const subscribe = createHistory(router, mode);
    ReactDOM.render(<Root />, el);
    return subscribe();
  }

  const createRoute = (url: string, ...components: React.FunctionComponent[]) => {
    router.on(url, () => {
      if (components.length > 0) {
        const middlewares = components.slice(0, -1);
        const page = components.slice(-1) as [React.FunctionComponent];
        setPage(page[0]);
        setMiddlewares(middlewares);
      }
    });
    return () => router.off(url);
  }

  const buildControllers = () => {
    controllers.forEach(component => {
      const meta = AnnotationMetaDataScan(component, container);
      const controller = meta.meta.get<string>(Controller.namespace);
      if (!controller) return;
      const controllerMiddlewares = meta.meta.got(Middleware.namespace, []);
      const middlewares = globalMiddlewares.concat(controllerMiddlewares);
      middlewares.push(useComponent(component));
      return createRoute(controller, ...middlewares);
    });
  }

  return {
    bootstrap,
    createRoute,
    createNotFoundComponent,
    allowMiddlewareSize,
    useGlobalMiddlewares,
    defineController,
  }
}