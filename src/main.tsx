import React from 'react';
import { createServer, redirect, inject } from '.';
import { Component, Controller, Middleware, Service } from './decorators';
import { TRequest } from './request';

@Service()
class sevice {
  sum(a: number, b: number) {
    return a + b;
  }
}

@Component()
class abc {
  render(props: React.PropsWithChildren<TRequest>) {
    return <div>
      <h1>this is header</h1>
      {props.children}
    </div>
  }
}

@Component()
class hhh {
  render(props: React.PropsWithChildren<TRequest>) {
    return <div>
      <h2>this is hhhh</h2>
      {props.children}
    </div>
  }
}

@Component()
@Controller('/')
@Middleware(abc)
@Middleware(hhh)
class test {
  @inject(sevice) private readonly service: sevice;
  render(props: React.PropsWithChildren<TRequest>) {
    const value = this.service.sum(9, 23);
    return <div onClick={() => redirect('/api/33')}>{props.href} - {value}</div>
  }
}

const { bootstrap/*, createRoute*/, createNotFoundComponent } = createServer(document.getElementById('root'), [
  test
]);

createNotFoundComponent(request => {
  return <div>not found: {request.pathname}</div>
})

bootstrap('popstate');