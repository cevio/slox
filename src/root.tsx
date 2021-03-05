import React, { Fragment, PropsWithChildren } from 'react';
import { ref } from '@vue/reactivity';
import { useReactiveState } from './effect';

const componentReference = ref<React.FunctionComponent>(null);

export function Root() {
  const ComponentRenderer = useReactiveState(() => componentReference.value || noopTemplateTransform);
  return <ComponentRenderer />;
}

export function setComponent(component: React.FunctionComponent) {
  if (component === componentReference.value) return;
  componentReference.value = component;
}

function noopTemplateTransform(props: PropsWithChildren<{}>) {
  return <Fragment>{props.children}</Fragment>;
}