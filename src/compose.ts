import React from 'react';

export type TComponentMiddlewareProps = { Next?: TComponentMiddleware };
export type TComponentMiddleware = React.FunctionComponent<TComponentMiddlewareProps>;

export function compose(components: TComponentMiddleware[]) {
  return () => {
    return components.reduce((Prev: React.ReactElement, Next: React.FunctionComponent) => {
      return React.createElement(Next, null, Prev);
    }, null);
  }
}