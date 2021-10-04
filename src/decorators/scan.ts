import { MethodMetaCreator } from "../annotates/methodMetaCreator";

export function classScan<TFunction extends Function>(target: TFunction) {
  const properties = Object.getOwnPropertyNames(target.prototype);
  properties.forEach(property => {
    if (property === 'constructor') return;
    if (typeof target.prototype[property] === 'function') {
      const descriptor = Object.getOwnPropertyDescriptor(target.prototype, property);
      const instance = MethodMetaCreator.instance(descriptor);
      if (instance.size) {
        target.prototype[property].__descriptor__ = descriptor;
      }
    }
  })
}