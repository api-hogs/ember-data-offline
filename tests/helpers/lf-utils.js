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
    }
  };
};

export { getLFObjectInfo };
