export const isArray = (value) => Array.isArray(value);
export const isFunction = (value) => typeof value === 'function';
export function isObject(value) {
  return (
    value && typeof value === 'object' && !isArray(value) && !isFunction(value)
  );
}
