import { ClassMetaCreator } from "../annotates";

export function Controller(url: string = '/') {
  return ClassMetaCreator.push(Controller.namespace, url);
}

Controller.namespace = Symbol('CONTROLLER');