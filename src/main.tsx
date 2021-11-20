import React from 'react';
import { createServer, Memo } from '.';
import { Component, Controller, Service } from './decorators';
import { useLocation } from './request';

@Service()
class sevice {
  sum(a: number, b: number) {
    return a + b;
  }
}

@Component()
@Controller('/')
class test extends sevice {
  @Memo()
  render(props: React.PropsWithChildren<{}>) {
    return <div>1 + 2 = {this.sum(1, 2)}</div>
  }
}

const { 
  bootstrap, 
  createNotFoundComponent, 
  defineController,
} = createServer();

defineController(test)

createNotFoundComponent(() => {
  const href = useLocation(req => req.pathname);
  return <div>not found: {href}</div>
})

bootstrap('popstate', document.getElementById('root'));