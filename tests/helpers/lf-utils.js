var getLFObjectInfo = function getLFObjectInfo(obj) {
  let keys = Object.keys(obj);
  let length = keys.length;
  let firstObject = obj[keys[0]];
  let lastObject = obj[keys[length - 1]];

  return {
    length: length,
    firstObject: firstObject,
    lastObject: lastObject,
    nth(n) {
      return obj[keys[n]];
    },
    find(prop, val) {
      let key = keys.filter(key => {
        return obj[key][prop] === val;
      })[0];
      return obj[key];
    }
  };
};

export { getLFObjectInfo };
