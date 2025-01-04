const { log, info, warn, error, table } = console;

const prettyPrint = {
  log(object: unknown) {
    log(JSON.stringify(object, undefined, 2));
  },

  info(object: unknown) {
    info(JSON.stringify(object, undefined, 2));
  },

  warn(object: unknown) {
    warn(JSON.stringify(object, undefined, 2));
  },

  error(object: unknown) {
    error(JSON.stringify(object, undefined, 2));
  },

  table(object: unknown) {
    table(JSON.stringify(object, undefined, 2));
  }
};

export default prettyPrint;
