import { isObject } from "@vue/shared";
import {
  reactiveHandler,
  shallowReactiveHandler,
  readonlyHandler,
  shallowReadonlyHandler,
} from "./baseHandlers"

// key是对象，且需要自动垃圾回收,WeakMap满足需求
export const reactiveMap = new WeakMap<object, any>()
export const shallowReactiveMap = new WeakMap<object, any>()
export const readonlyMap = new WeakMap<object, any>()
export const shallowReadonlyMap = new WeakMap<object, any>()

function reactive(target: any) {
  return createReactiveObject(target, false, reactiveHandler, reactiveMap);
}

function shallowReactive(target: any) {
  return createReactiveObject(target, false, shallowReactiveHandler, shallowReactiveMap);
}

function readonly(target: any) {
  return createReactiveObject(target, true, readonlyHandler, readonlyMap);
}

function shallowReadonly(target: any) {
  return createReactiveObject(target, true, shallowReadonlyHandler, shallowReadonlyMap);
}

// 创建代理对象（根据不同参数）
function createReactiveObject(
  target: object,
  isReadonly: boolean,
  baseHandlers: ProxyHandler<object>,
  proxyMap: WeakMap<object, any>,
  ) {
  // 非对象直接返回
  if(!isObject(target)) {
    return target;
  }
  // 已代理对象直接返回
  const existingProxy = proxyMap.get(target)
  if (existingProxy) {
    return existingProxy
  }

  const proxy = new Proxy(target, baseHandlers);
  proxyMap.set(target, proxy);
  return proxy;
}

export {
  reactive,
  shallowReactive,
  readonly,
  shallowReadonly,
}