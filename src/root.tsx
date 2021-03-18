import React, { Fragment } from 'react';
import { ref } from '@vue/reactivity';
import { useReactiveState } from './effect';

const middlewares = ref<React.FunctionComponent[]>([]);

export function Root() {
  return useReactiveState(() => {
    let next = React.createElement(Fragment);
    let i = middlewares.value.length;
    while (i--) next = React.createElement(middlewares.value[i], null, next);
    return next;
  });
}

export function setComponents(components: React.FunctionComponent[] = []) {
  middlewares.value = components;
}