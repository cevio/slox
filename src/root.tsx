import React, { Fragment, PropsWithChildren, ReactElement } from 'react';
import { ref } from '@vue/reactivity';
import { useReactiveState } from './effect';
import { Request, TRequest } from './request';

type TComponent = (props: PropsWithChildren<TRequest>) => ReactElement;

const componentReference = ref<TComponent>(null);

export function Root() {
  const ComponentRenderer = useReactiveState(() => componentReference.value || noopTemplateTransform);
  const request = useReactiveState(() => ({...Request}));
  return <ComponentRenderer {...request} />;
}

export function setComponent(component: TComponent) {
  if (component === componentReference.value) return;
  componentReference.value = component;
}

function noopTemplateTransform(props: Parameters<TComponent>[0]) {
  return <Fragment>{props.children}</Fragment>;
}