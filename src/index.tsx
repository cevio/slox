import React, { useMemo } from 'react';
import ReactDOM from 'react-dom';
import { Root } from './root';
import { Container } from 'inversify';
import { Router } from './router';
import { createHistory, History, THistory } from './history';
import { compose } from './compose';
import { TRequest, redirect, replace } from './request';
import { Controller, Middleware, TComponent } from './decorators';
import { AnnotationMetaDataScan, ClassMetaCreator } from './annotates';

export * from './annotates';
export * from './decorators';
export * from 'inversify';
export * from './effect';
export {
  redirect,
  replace,
  TRequest
};

export const URL_BUILD_NAME = Symbol('URL_BUILD_NAME');
export const container = new Container();
export function createServer<E extends HTMLElement = HTMLElement>(el: E, components: TComponent[] = []) {
  if (History.mode) throw new Error('you have already bootstrap the app!');

  ReactDOM.render(<Root />, el);

  const createNotFoundComponent = (component: THistory['notFoundComponent']) => History.notFoundComponent = component;

  const router = new Router({
    maxParamLength: Infinity,
    ignoreTrailingSlash: true,
    caseSensitive: true,
  });

  const bootstrap = (mode: Parameters<typeof createHistory>[1]) => {
    const subscribe = createHistory(router, mode);
    return subscribe();
  }

  const createRoute = (url: string, ...components: React.FunctionComponent<TRequest>[]) => {
    router.on(url, compose(components.reverse()));
    return () => router.off(url);
  }

  components.forEach(component => {
    const meta = AnnotationMetaDataScan(component, container);
    const controller = meta.meta.get<string>(Controller.namespace);
    if (!controller) return;
    const middlewares = meta.meta.got(Middleware.namespace, []);
    middlewares.push((props: React.PropsWithChildren<TRequest>) => {
      const target = useMemo(() => container.get(component), [component]);
      return React.createElement(target.render.bind(target), props, props.children);
    });
    const builder = createRoute(controller, ...middlewares);
    ClassMetaCreator.define(URL_BUILD_NAME, builder)(component);
  });

  return {
    bootstrap,
    createRoute,
    createNotFoundComponent
  }
}