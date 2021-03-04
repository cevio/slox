import React from 'react';

export function compose<T = {}>(components: React.FunctionComponent<T>[]) {
  return components.reduce((Prev, Next) => {
    return (props: T) => {
      return React.createElement(Next, props, React.createElement(Prev, props));
    }
  });
}