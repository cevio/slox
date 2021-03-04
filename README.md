# SLOX

基于React的轻量的路由管理模块，具备组件式中间件能力。

## Install

```bash
$ npm i slox
```

## Usage

创建一个应用服务.

```ts
const { bootstrap, createNotFoundComponent } = createServer(document.getElementById('root'));

createNotFoundComponent(request => {
  return <div>not found: {request.pathname}</div>
})

bootstrap('popstate');
```

### createServer(element: HTMLElement, components?: TComponent[])

创建服务

**Arguments:**

- `element` 节点
- `components` 组件数组：必须为IOC组件，同时必须携带controller注解


**ReturnValue:**

- `bootstrap: (mode: 'hashchange' | 'popstate') => () => void` 启动服务，并且返回一个卸载服务的方法
- `createRoute: (url, ...components: React.FunctionComponent[]) => () => void` 注册路由，以及使用路由组件式中间件。返回一个卸载路由的方法。
- `createNotFoundComponent: (component: (props: React.PropsWithChildren<TRequest>) => React.ReactElement) => void` 注册找不到路由的页面

### Componet

采用一切皆组件的思想来完成组件操作

#### @Component

```tsx
@Component()
class hhh {
  render(props: React.PropsWithChildren<TRequest>) {
    return <div>
      <h2>this is hhhh</h2>
      {props.children}
    </div>
  }
}
```

#### @Service

```tsx
@Service()
class sevice {
  sum(a: number, b: number) {
    return a + b;
  }
}
```

#### @Controller

```tsx
@Component()
@Controller('/')
class test {
  @inject(sevice) private readonly service: sevice;
  render(props: React.PropsWithChildren<TRequest>) {
    const value = this.service.sum(9, 23);
    return <div onClick={() => redirect('/api/33')}>{props.href} - {value}</div>
  }
}
```

#### @Middleware

```tsx
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
```
