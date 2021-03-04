import { ClassMetaCreator } from "../annotates";

export function Controller(url: string = '/') {
  return ClassMetaCreator.define(Controller.namespace, url);
}

Controller.namespace = Symbol('CONTROLLER');