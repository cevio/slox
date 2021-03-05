import { createContext, useContext } from 'react';
import URL from 'url-parse';
import { reactive } from '@vue/reactivity';
import { History } from './history';
import { useReactiveState } from './effect';

export interface TRequest {
  protocol: URL['protocol'],
  slashes: URL['slashes'],
  auth: URL['auth'],
  username: URL['username'],
  password: URL['password'],
  host: URL['host'],
  hostname: URL['hostname'],
  port: URL['port'],
  pathname: URL['pathname'],
  query: URL['query'],
  hash: URL['hash'],
  href: URL['href'],
  origin: URL['origin'],
  params: Record<string, string>,
}

export const Request = reactive<TRequest>({
  protocol: null,
  slashes: false,
  auth: null,
  username: null,
  password: null,
  host: null,
  hostname: null,
  port: null,
  pathname: null,
  query: {},
  hash: null,
  href: null,
  origin: null,
  params: {},
});

export function assign(url: URL, params: TRequest['params'] = {}) {
  Request.protocol = url.protocol;
  Request.slashes = url.slashes;
  Request.auth = url.auth;
  Request.username = url.username;
  Request.password = url.password;
  Request.host = url.host;
  Request.hostname = url.hostname;
  Request.port = url.port;
  Request.pathname = url.pathname;
  Request.query = url.query;
  Request.hash = url.hash;
  Request.href = url.href;
  Request.origin = url.origin;
  Request.params = params;
  return Request;
}

export function redirect(url: string = '/') {
  switch (History.mode) {
    case 'popstate':
      window.history.pushState(null, window.document.title, url);
      History.listener();
      break;
    case 'hashchange':
      window.location.hash = url;
      break;
  }
}

export function replace(url: string = '/') {
  switch (History.mode) {
    case 'popstate':
      window.history.pushState(null, window.document.title, url);
      History.listener();
      break;
    case 'hashchange':
      window.location.hash = url;
      break;
  }
}

export function useRequest<T>(callback: (req: TRequest) => T) {
  return useReactiveState(() => callback(Request));
}