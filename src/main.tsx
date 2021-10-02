import React, { Fragment, useRef, useState } from 'react';
import { createServer, redirect, inject, Memo, ForwardRef, useComponentWithMethod, useComponent } from '.';
import { Component, Controller, Middleware, Service } from './decorators';
import { useLocation } from './request';
import { useReactiveState } from './state';
import { ref, reactive } from '@vue/reactivity';
import { usePromise } from './promise';
import axios from 'axios';

// @Service()
// class sevice {
//   sum(a: number, b: number) {
//     return a + b;
//   }
// }

@Component()
class A {
  render(props: React.PropsWithChildren<{ text: string }>) {
    console.log('render A')
    return <div>
      <h1>this is A - {props.text}</h1>
      {props.children}
    </div>
  }

  kkk() {
    return <div>kkk</div>
  }
}

@Component()
class B {
  render(props: React.PropsWithChildren<{ text: string }>) {
    console.log('render B')
    return <div>
      <h2>this is B</h2>
      {props.children}
    </div>
  }
}

@Component()
class C {
  render(props: React.PropsWithChildren<{ text: string }>) {
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

// const a = ref(0);
// const b = reactive({
//   a: 1
// })

// const cancelToken = axios.CancelToken;

const XXX = React.forwardRef<HTMLInputElement, { a: number}>((e, r) => {
  return <input type="text" ref={r} />
})

@Component()
@Controller('/')
@Middleware(A, { text: '1' })
@Middleware(B)
@Middleware(C)
class test {
  // @inject(sevice) private readonly service: sevice;
  @inject(A) private readonly A: A;
  @Memo()
  render(props: React.PropsWithChildren<{}>) {
    const ref = useRef<HTMLInputElement>(null);
    const AAA = useComponentWithMethod(this.aaa, this);
    const BBB = useComponentWithMethod(this.bbb, this);
    const CCC = useComponent(this.A);
    const DDD = useComponentWithMethod(this.A.kkk, this.A);
    const onClick = () => {
      console.log(ref)
      if (ref.current) {
        ref.current.focus();
      }
    }
    return <Fragment>
      <div onClick={onClick}>dsfa</div>
      <BBB a={2} />
      <AAA ref={ref} a={1} />
      <CCC text="xxx" />
      <DDD />
    </Fragment>
  }

  @ForwardRef()
  private aaa(props: React.PropsWithoutRef<{a: number}>, ref: React.ForwardedRef<HTMLInputElement>) {
    return <input type="text" ref={ref} />
  }

  private bbb(props: React.PropsWithoutRef<{a: number}>) {
    return <div>dsfa</div>
  }
}

// @Component()
// @Controller('/api/:id(\\d+)')
// @Middleware(A, { text: '2' })
// // @Middleware(B)
// // @Middleware(C)
// class test2 {
//   @inject(sevice) private readonly service: sevice;
//   render(props: React.PropsWithChildren<{}>) {
//     const value = this.service.sum(9, 23);
//     const href = useLocation(req => req.href);
//     return <div>
//       <button onClick={() => redirect('/')}>home</button>
//       <button onClick={() => redirect('/api/' + (Math.random() * 1000).toFixed(0))}>another</button>
//       <button onClick={() => redirect('/99aofsa')}>not found</button>
//       {href} - {value} - {props.children}
//     </div>
//   }
// }

const { 
  bootstrap, 
  createNotFoundComponent, 
  useGlobalMiddlewares,
  defineController,
} = createServer();

useGlobalMiddlewares(A, { text: 'A'});
useGlobalMiddlewares(B, { text: 'B'});
useGlobalMiddlewares(C, { text: 'C'});
defineController(test)

createNotFoundComponent(() => {
  const href = useLocation(req => req.pathname);
  return <div>not found: {href}</div>
})

bootstrap('popstate', document.getElementById('root'));

// function useConstom(): [number, React.Dispatch<React.SetStateAction<number>>] {
//   const [a, setA] = useState(0)
//   return [a, setA];
// }


// const abc = ref<React.FunctionComponent>(() => <div>111</div>);
// ReactDOM.render(<Page />, document.getElementById('root'));

// function Page() {
//   const Zpage = useReactiveState(() => abc.value);
//   return <div>
//     <button onClick={() => abc.value=Opage}>invoke</button>
//     <Zpage />
//   </div>
// }

// function Opage() {
//   return <div>222</div>
// }