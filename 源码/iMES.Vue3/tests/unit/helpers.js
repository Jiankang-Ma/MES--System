export function createSpy(implementation) {
  const fn = function(...args) {
    fn.calls.push(args);
    if (implementation) {
      return implementation.apply(this, args);
    }
  };
  fn.calls = [];
  return fn;
}

export function bindMethods(component, context) {
  Object.keys(component.methods || {}).forEach((name) => {
    context[name] = component.methods[name].bind(context);
  });
  return context;
}

export function flushPromises() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

export class FormDataMock {
  constructor() {
    this.entries = [];
  }

  append(...args) {
    this.entries.push(args);
  }
}
