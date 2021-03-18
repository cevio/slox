import React, { useMemo } from 'react';
import ReactDOM from 'react-dom';
import { Root, setComponents } from './root';
import { Container } from 'inversify';
import { Router } from './router';
import { createHistory, History, THistory } from './history';
import { compose } from './compose';
import { redirect, replace, useRequest } from './request';
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
  useRequest
}

const router = new Router({
  maxParamLength: Infinity,
  ignoreTrailingSlash: true,
  caseSensitive: true,
});


export const container = new Container();
export function createServer<E extends HTMLElement = HTMLElement>(el: E, components: TComponent[] = []) {
  if (History.mode) throw new Error('you have already bootstrap the app!');

  ReactDOM.render(<Root />, el);

  const createNotFoundComponent = (component: THistory['notFoundComponent']) => History.notFoundComponent = component;
  const bootstrap = (mode: Parameters<typeof createHistory>[1]) => {
    const subscribe = createHistory(router, mode);
    return subscribe();
  }

  const createRoute = (url: string, ...components: React.FunctionComponent[]) => {
    router.on(url, () => setComponents(components));
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
    createNotFoundComponent
  }
}