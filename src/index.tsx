import React from 'react';
import ReactDOM from 'react-dom';
import { Root, createCachedMiddlewareComponent, setPage, setMiddlewares } from './root';
import { Container } from 'inversify';
import { Router } from './router';
import { createHistory, History, THistory } from './history';
import { redirect, replace, useLocation } from './request';
import { Controller, Middleware, TComponent, useComponent } from './decorators';
import { AnnotationMetaDataScan } from './annotates';

export * from 'inversify';
export * from '@vue/reactivity';

export * from './annotates';
export * from './decorators';
export * from './effect';
export {
  redirect, 
  replace,
  useLocation
}

const router = new Router({
  maxParamLength: Infinity,
  ignoreTrailingSlash: true,
  caseSensitive: true,
});


export const container = new Container();
export function createServer(...components: TComponent[]) {
  if (History.mode) throw new Error('you have already bootstrap the app!');

  let middlewareSetup = false;
  const allowMiddlewareSize = (i: number) => {
    for (let j = 0; j < i; j++) {
      createCachedMiddlewareComponent();
    }
    middlewareSetup = true;
  }
  const createNotFoundComponent = (component: THistory['notFoundComponent']) => History.notFoundComponent = component;
  const bootstrap = <E extends HTMLElement = HTMLElement>(mode: Parameters<typeof createHistory>[1], el: E) => {
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

  components.forEach(component => {
    const meta = AnnotationMetaDataScan(component, container);
    const controller = meta.meta.get<string>(Controller.namespace);
    if (!controller) return;
    const middlewares = meta.meta.got(Middleware.namespace, []);
    middlewares.push(useComponent(component));
    return createRoute(controller, ...middlewares);
  });

  return {
    bootstrap,
    createRoute,
    createNotFoundComponent,
    allowMiddlewareSize
  }
}