import React, { Fragment, useEffect, useState } from 'react';
import { TMiddlewareState } from './interface';

export function Root(props: React.PropsWithoutRef<{ 
  bootstrap: (setMiddlewares: React.Dispatch<React.SetStateAction<TMiddlewareState<any, any>[]>>) => void 
}>) {
  const [middlewares, setMiddlewares] = useState<TMiddlewareState<any, any>[]>([]);
  let next = React.createElement(Fragment);
  let i = middlewares.length;
  while (i--) {
    next = React.createElement(middlewares[i].middleware, middlewares[i].props || {}, next);
  }
  useEffect(() => props.bootstrap(setMiddlewares), [props.bootstrap]);
  return next;
}