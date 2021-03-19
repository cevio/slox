import React from 'react';
import { createServer, redirect, inject } from '.';
import { Component, Controller, Middleware, Service } from './decorators';
import { useLocation } from './request';
import { Container, injectable } from 'inversify';

@Service()
class sevice {
  sum(a: number, b: number) {
    return a + b;
  }
}

@Component()
class A {
  render(props: React.PropsWithChildren<{}>) {
    console.log('render A')
    return <div>
      <h1>this is A</h1>
      {props.children}
    </div>
  }
}

@Component()
class B {
  render(props: React.PropsWithChildren<{}>) {
    console.log('render B')
    return <div>
      <h2>this is B</h2>
      {props.children}
    </div>
  }
}

@Component()
class C {
  render(props: React.PropsWithChildren<{}>) {
    console.log('render C')
    return <div>
      <h2>this is C</h2>
      {props.children}
    </div>
  }
}

// function A(props: React.PropsWithChildren<{}>) {
//   console.log('render A')
//   return <div>
//     <h1>this is A</h1>
//     {props.children}
//   </div>
// }

// function B(props: React.PropsWithChildren<{}>) {
//   console.log('render B')
//   return <div>
//     <h2>this is B</h2>
//     {props.children}
//   </div>
// }

// function C(props: React.PropsWithChildren<{}>) {
//   console.log('render C')
//   return <div>
//     <h2>this is C</h2>
//     {props.children}
//   </div>
// }

@Component()
@Controller('/')
@Middleware(A)
@Middleware(B)
@Middleware(C)
class test {
  @inject(sevice) private readonly service: sevice;
  render(props: React.PropsWithChildren<{}>) {
    const value = this.service.sum(9, 23);
    const href = useLocation(req => req.href);
    return <div>
      <button onClick={() => redirect('/api/99')}>go</button>
      {href} - {value} - {props.children}</div>
  }
}

@Component()
@Controller('/api/:id(\\d+)')
@Middleware(A)
@Middleware(B)
@Middleware(C)
class test2 {
  @inject(sevice) private readonly service: sevice;
  render(props: React.PropsWithChildren<{}>) {
    const value = this.service.sum(9, 23);
    const href = useLocation(req => req.href);
    return <div>
      <button onClick={() => redirect('/')}>home</button>
      <button onClick={() => redirect('/api/' + (Math.random() * 1000).toFixed(0))}>another</button>
      <button onClick={() => redirect('/99aofsa')}>not found</button>
      {href} - {value} - {props.children}
    </div>
  }
}

const { 
  bootstrap, 
  createNotFoundComponent, 
  allowMiddlewareSize 
} = createServer(
  test,
  test2
);

allowMiddlewareSize(3);

createNotFoundComponent(() => {
  const href = useLocation(req => req.pathname);
  return <div>not found: {href}</div>
})




bootstrap('popstate', document.getElementById('root'));