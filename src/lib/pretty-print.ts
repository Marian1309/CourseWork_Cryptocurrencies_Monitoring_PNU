const prettyPrint = (object: unknown) => {
  console.log(JSON.stringify(object, undefined, 2));
};

export default prettyPrint;
