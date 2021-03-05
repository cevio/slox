import React from 'react';
import { createServer, redirect, inject } from '.';
import { Component, Controller, Middleware, Service } from './decorators';
import { useRequest } from './request';

@Service()
class sevice {
  sum(a: number, b: number) {
    return a + b;
  }
}

@Component()
class abc {
  render(props: React.PropsWithChildren<{}>) {
    console.log('render abc')
    return <div>
      <h1>this is header</h1>
      {props.children}
    </div>
  }
}

@Component()
class hhh {
  render(props: React.PropsWithChildren<{}>) {
    console.log('render hhh')
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
  render(props: React.PropsWithChildren<{}>) {
    const value = this.service.sum(9, 23);
    const href = useRequest(req => req.href);
    console.log('render test')
    return <div onClick={() => redirect('/api/33')}>{href} - {value} - {props.children}</div>
  }
}

@Component()
@Controller('/api/:id(\\d+)')
@Middleware(abc)
@Middleware(hhh)
class test2 {
  @inject(sevice) private readonly service: sevice;
  render(props: React.PropsWithChildren<{}>) {
    const value = this.service.sum(9, 23);
    const href = useRequest(req => req.href);
    console.log('render test2')
    return <div onClick={() => redirect('/api/' + (Math.random() * 1000).toFixed(0))}>{href} - {value} - {props.children}</div>
  }
}

const { bootstrap/*, createRoute*/, createNotFoundComponent } = createServer(document.getElementById('root'), [
  test,test2
]);

createNotFoundComponent(() => {
  const href = useRequest(req => req.pathname);
  return <div>not found: {href}</div>
})

bootstrap('popstate');