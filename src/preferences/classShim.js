/* exported registerClass */

const {
  lang: Lang,
  gi: { GObject }
} = imports;

function registerClass(...args) {
  if (typeof GObject.registerClass === 'function') {
    return GObject.registerClass(...args);
  }

  let meta = {};
  let [klass] = args;

  if (args.length > 1) {
    [, klass] = args;

    meta = { ...args[0] };
  }

  meta.Name = `shim__${klass.name}`;
  meta.Extends = Object.getPrototypeOf(klass);

  log(`Assigning: ${JSON.stringify(Object.getOwnPropertyNames(klass.prototype))}`);

  Object.getOwnPropertyNames(klass.prototype).forEach((nm) => {
    meta[nm] = klass.prototype[nm];
  });

  delete meta.constructor;

  log(`Assigned: ${JSON.stringify(Object.getOwnPropertyNames(meta))}`);

  return new Lang.Class(meta);
}