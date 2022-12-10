function isObject(target: any): boolean {
  return typeof target === 'object' && target !== null;
}

export {
  isObject,
}