export function createLocalStorageMock(initialValues = {}) {
  let values = Object.keys(initialValues).reduce((result, key) => {
    result[String(key)] = String(initialValues[key])
    return result
  }, {})

  return {
    get length() {
      return Object.keys(values).length
    },
    clear() {
      values = {}
    },
    getItem(key) {
      key = String(key)
      return Object.prototype.hasOwnProperty.call(values, key)
        ? values[key]
        : null
    },
    key(index) {
      return Object.keys(values)[index] || null
    },
    removeItem(key) {
      delete values[String(key)]
    },
    setItem(key, value) {
      values[String(key)] = String(value)
    }
  }
}

export function installLocalStorageMock(initialValues) {
  global.localStorage = createLocalStorageMock(initialValues)
  return global.localStorage
}
