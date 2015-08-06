/**
!! This is not a class. It's a ES6 module.
@module utils
@class IsObjectEmpty
**/

/**
Checks if object is empty.
@method isObjectEmpty
@param obj {Object}
@return {boolean}
**/
export default function(obj) {
  return Object.keys(obj).length === 0;
}
