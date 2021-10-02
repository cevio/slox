import Url from 'url-parse';
import { Router } from './router';
import { assign } from './request';
import { FunctionComponent } from 'react';
import { TMiddlewareState } from './interface';

export interface THistory {
  mode: 'hashchange' | 'popstate',
  listener: () => void,
  notFoundComponent: FunctionComponent,
}

export const History: THistory = {
  mode: null,
  listener: () => {},
  notFoundComponent: () => null,
}

export function createHistory(
  router: Router, 
  mode: 'hashchange' | 'popstate' = 'hashchange', 
  set: React.Dispatch<React.SetStateAction<TMiddlewareState<any, any>[]>>
) {
  if (mode === 'popstate') {
    if (!window.history.pushState || window.location.protocol.toLowerCase().indexOf('file:') === 0) {
      mode = 'hashchange';
    }
  }

  History.mode = mode;

  const listener = History.listener = () => {
    const url = getUrlByLocation(mode);
    const matched = router.find(url.pathname);
    if (matched) {
      assign(url, matched.params);
      matched.handler();
    } else {
      assign(url);
      set([{ middleware: History.notFoundComponent }]);
    }
    return () => window.removeEventListener(mode, listener);
  }
 
  return () => {
    window.addEventListener(mode, listener);
    return listener();
  };
}

function getUrlByLocation(mode: Parameters<typeof createHistory>[1]) {
  const href = new Url(window.location.href, true);
  if (mode === 'hashchange') {
    const hash = window.location.hash.replace(/^\#/, '') || '/';
    const _hash = new Url(hash, true);
    href.set('pathname', _hash.pathname);
    href.set('query', _hash.query);
    href.set('hash', _hash.hash);
  }
  return href;
}