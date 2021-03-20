import React, { Fragment } from 'react';
import { ref, Ref } from '@vue/reactivity';
import { useReactiveState } from './state';

const pageReactiveState = ref<React.FunctionComponent>(Fragment);
const componentReactiveMiddlewares: Ref<React.FunctionComponent>[] = [];
const componentCachedMiddlewares: React.FunctionComponent[] = [];

export function setPage(page: React.FunctionComponent) {
  if (page === pageReactiveState.value) return;
  pageReactiveState.value = page;
}

export function setMiddlewares(middlewares: React.FunctionComponent[] = []) {
  if (middlewares.length > componentCachedMiddlewares.length) throw new Error(
    'Maxium size limited of middlewares: <' + 
    componentCachedMiddlewares.length + 
    ',' + middlewares.length + '>'
  );
  let i = componentCachedMiddlewares.length;
  while (i--) {
    const component = middlewares[i];
    const _ref = componentReactiveMiddlewares[i];
    if (_ref.value !== component) {
      _ref.value = component || null;
    }
  }
}

export function Root() {
  return React.createElement(Middlewares as React.FunctionComponent, null, React.createElement(Page));
}

export function createCachedMiddlewareComponent() {
  componentCachedMiddlewares.push(createMiddlewareCacheComponent());
}

function Middlewares(props: React.PropsWithChildren<{}>) {
  let next = props.children || React.createElement(Fragment);
  let i = componentCachedMiddlewares.length;
  while (i--) next = React.createElement(componentCachedMiddlewares[i], {}, next);
  return next;
}

function Page() {
  const page = useReactiveState(() => pageReactiveState.value);
  return React.createElement(page);
}

function createMiddlewareCacheComponent() {
  const index = componentReactiveMiddlewares.length;
  const _ref = ref<React.FunctionComponent>(Fragment);
  componentReactiveMiddlewares[index] = _ref;
  return (props: React.PropsWithChildren<{}>) => {
    const component = useReactiveState(() => _ref.value || Fragment);
    return React.createElement(component, null, props.children);
  }
}