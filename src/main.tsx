import React, { Fragment, useImperativeHandle, useRef, useState } from 'react';
import { createServer, redirect, inject, Memo, ForwardRef, useComponentWithMethod, useComponent } from '.';
import { Component, Controller, Middleware, Service } from './decorators';
import { useLocation } from './request';
import { useReactiveState } from './state';
import { ref, reactive } from '@vue/reactivity';
import { usePromise } from './promise';
import axios from 'axios';

@Service()
class sevice {
  sum(a: number, b: number) {
    return a + b;
  }
}

// @Component()
// class A {
//   @ForwardRef()
//   render(props: React.PropsWithChildren<{ text: string }>, ref: React.ForwardedRef<HTMLDivElement>) {
//     console.log('render A')
//     const domRef = useRef<HTMLDivElement>(null);
//     useImperativeHandle(ref, () => domRef.current);
//     return <div ref={domRef}>
//       <h1>this is A - {props.text}</h1>
//       {props.children}
//     </div>
//   }

//   kkk() {
//     return <div>kkk</div>
//   }
// }

// @Component()
// class B {
//   render(props: React.PropsWithChildren<{ text: string }>) {
//     console.log('render B')
//     return <div>
//       <h2>this is B</h2>
//       {props.children}
//     </div>
//   }
// }

// @Component()
// class C {
//   render(props: React.PropsWithChildren<{ text: string }>) {
//     console.log('render C')
//     return <div>
//       <h2>this is C</h2>
//       {props.children}
//     </div>
//   }
// }

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

@Component()
@Controller('/')
// @Middleware(A, { text: '1' })
// @Middleware(B)
// @Middleware(C)
class test extends sevice {
  // @inject(sevice) private readonly service: sevice;
  // @inject(A) private readonly A: A;
  @Memo()
  render(props: React.PropsWithChildren<{}>) {
    return <div>dsafx</div>
  }

  @ForwardRef()
  private aaa(props: React.PropsWithoutRef<{a: number}>, ref: React.ForwardedRef<HTMLInputElement>) {
    return <input type="text" ref={ref} />
  }

  private bbb(props: React.PropsWithoutRef<{a: number}>) {
    return <div>dsfa</div>
  }
}

@Component()
@Controller('/test')
// @Middleware(A, { text: '2' })
// @Middleware(B)
// @Middleware(C)
class test2 extends sevice {
  @inject(sevice) private readonly service: sevice;
  render(props: React.PropsWithChildren<{}>) {
    return <div>sdaf</div>
  }
}

const { 
  bootstrap, 
  createNotFoundComponent, 
  useGlobalMiddlewares,
  defineController,
} = createServer();

// useGlobalMiddlewares(A, { text: 'A'});
// useGlobalMiddlewares(B, { text: 'B'});
// useGlobalMiddlewares(C, { text: 'C'});
defineController(test)
defineController(test2)

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