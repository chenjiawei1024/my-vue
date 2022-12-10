import { isObject } from "@vue/shared"
import {
  reactive,
  readonly,
} from "./reactive"

const get = /*#__PURE__*/ createGetter()
const shallowGet = /*#__PURE__*/ createGetter(false, true)
const readonlyGet = /*#__PURE__*/ createGetter(true)
const shallowReadonlyGet = /*#__PURE__*/ createGetter(true, true)

// 构建get的柯里化工具函数
function createGetter(isReadonly = false, shallow = false) {
  return function get(target: any, key: string | symbol, receiver: object) {
    const res = Reflect.get(target, key, receiver);

    if(isReadonly) {
      // 收集依赖
    }

    if(shallow) {
      return res;
    }

    // 递归深层代理
    if(isObject(res)) {
      return isReadonly ? readonly(res) : reactive(res);
    }

    return res;
  }
}

const set = /*#__PURE__*/ createSetter();
const shallowSet = /*#__PURE__*/ createSetter(true);

// 构建set的柯里化工具函数
function createSetter(shallow = false) {
  return function set(target: any, key: string | symbol, value: any, receiver: object) {
    const res = Reflect.set(target, key, value, receiver);
    // notify observers

    return res;
  }
}

const reactiveHandler: ProxyHandler<object> = {
  get,
  set,
};
const shallowReactiveHandler: ProxyHandler<object> = {
  get: shallowGet,
  set: shallowSet,
};
const readonlyHandler: ProxyHandler<object> = {
  get: readonlyGet,
  set: (target, key) => {
    console.warn(
      `Set operation on key "${String(key)}" failed: target is readonly.`,
      target
    )
    return true
  },
};
const shallowReadonlyHandler: ProxyHandler<object> = {
  get: shallowReadonlyGet,
  set: (target, key) => {
    console.warn(
      `Set operation on key "${String(key)}" failed: target is readonly.`,
      target
    )
    return true
  },
};

export {
  reactiveHandler,
  shallowReactiveHandler,
  readonlyHandler,
  shallowReadonlyHandler,
}