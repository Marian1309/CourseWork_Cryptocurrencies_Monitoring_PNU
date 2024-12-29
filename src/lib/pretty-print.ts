const prettyPrint = {
  log(object: unknown) {
    console.log(JSON.stringify(object, undefined, 2));
  },

  info(object: unknown) {
    console.info(JSON.stringify(object, undefined, 2));
  },

  warn(object: unknown) {
    console.warn(JSON.stringify(object, undefined, 2));
  },

  error(object: unknown) {
    console.error(JSON.stringify(object, undefined, 2));
  },

  table(object: unknown) {
    console.table(JSON.stringify(object, undefined, 2));
  }
};

export default prettyPrint;
