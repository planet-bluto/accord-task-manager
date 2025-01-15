function isObject(item: any): boolean {
  return item !== null && typeof item === 'object' && !Array.isArray(item);
}

export function deepAssign(target: any, ...sources: any[]): any {
  if (!target || typeof target !== 'object') {
    return target;
  }

  sources.forEach(source => {
    if (isObject(source)) {
      for (const key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          if (isObject(source[key])) {
            if (!target[key] || typeof target[key] !== 'object') {
              target[key] = {};
            }
            deepAssign(target[key], source[key]);
          } else {
            target[key] = source[key];
          }
        }
      }
    }
  });

  return target;
}