(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/browserify-middleware/node_modules/browserify/node_modules/process/browser.js":[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;

function drainQueue() {
    if (draining) {
        return;
    }
    draining = true;
    var currentQueue;
    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        var i = -1;
        while (++i < len) {
            currentQueue[i]();
        }
        len = queue.length;
    }
    draining = false;
}
process.nextTick = function (fun) {
    queue.push(fun);
    if (!draining) {
        setTimeout(drainQueue, 0);
    }
};

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/array/last.js":[function(require,module,exports){
/**
 * Gets the last element of `array`.
 *
 * @static
 * @memberOf _
 * @category Array
 * @param {Array} array The array to query.
 * @returns {*} Returns the last element of `array`.
 * @example
 *
 * _.last([1, 2, 3]);
 * // => 3
 */
function last(array) {
  var length = array ? array.length : 0;
  return length ? array[length - 1] : undefined;
}

module.exports = last;

},{}],"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/collection/all.js":[function(require,module,exports){
module.exports = require('./every');

},{"./every":"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/collection/every.js"}],"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/collection/every.js":[function(require,module,exports){
var arrayEvery = require('../internal/arrayEvery'),
    baseCallback = require('../internal/baseCallback'),
    baseEvery = require('../internal/baseEvery'),
    isArray = require('../lang/isArray'),
    isIterateeCall = require('../internal/isIterateeCall');

/**
 * Checks if `predicate` returns truthy for **all** elements of `collection`.
 * The predicate is bound to `thisArg` and invoked with three arguments:
 * (value, index|key, collection).
 *
 * If a property name is provided for `predicate` the created `_.property`
 * style callback returns the property value of the given element.
 *
 * If a value is also provided for `thisArg` the created `_.matchesProperty`
 * style callback returns `true` for elements that have a matching property
 * value, else `false`.
 *
 * If an object is provided for `predicate` the created `_.matches` style
 * callback returns `true` for elements that have the properties of the given
 * object, else `false`.
 *
 * @static
 * @memberOf _
 * @alias all
 * @category Collection
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {Function|Object|string} [predicate=_.identity] The function invoked
 *  per iteration.
 * @param {*} [thisArg] The `this` binding of `predicate`.
 * @returns {boolean} Returns `true` if all elements pass the predicate check,
 *  else `false`.
 * @example
 *
 * _.every([true, 1, null, 'yes'], Boolean);
 * // => false
 *
 * var users = [
 *   { 'user': 'barney', 'active': false },
 *   { 'user': 'fred',   'active': false }
 * ];
 *
 * // using the `_.matches` callback shorthand
 * _.every(users, { 'user': 'barney', 'active': false });
 * // => false
 *
 * // using the `_.matchesProperty` callback shorthand
 * _.every(users, 'active', false);
 * // => true
 *
 * // using the `_.property` callback shorthand
 * _.every(users, 'active');
 * // => false
 */
function every(collection, predicate, thisArg) {
  var func = isArray(collection) ? arrayEvery : baseEvery;
  if (thisArg && isIterateeCall(collection, predicate, thisArg)) {
    predicate = null;
  }
  if (typeof predicate != 'function' || thisArg !== undefined) {
    predicate = baseCallback(predicate, thisArg, 3);
  }
  return func(collection, predicate);
}

module.exports = every;

},{"../internal/arrayEvery":"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/internal/arrayEvery.js","../internal/baseCallback":"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/internal/baseCallback.js","../internal/baseEvery":"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/internal/baseEvery.js","../internal/isIterateeCall":"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/internal/isIterateeCall.js","../lang/isArray":"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/lang/isArray.js"}],"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/collection/shuffle.js":[function(require,module,exports){
var baseRandom = require('../internal/baseRandom'),
    toIterable = require('../internal/toIterable');

/**
 * Creates an array of shuffled values, using a version of the
 * [Fisher-Yates shuffle](https://en.wikipedia.org/wiki/Fisher-Yates_shuffle).
 *
 * @static
 * @memberOf _
 * @category Collection
 * @param {Array|Object|string} collection The collection to shuffle.
 * @returns {Array} Returns the new shuffled array.
 * @example
 *
 * _.shuffle([1, 2, 3, 4]);
 * // => [4, 1, 3, 2]
 */
function shuffle(collection) {
  collection = toIterable(collection);

  var index = -1,
      length = collection.length,
      result = Array(length);

  while (++index < length) {
    var rand = baseRandom(0, index);
    if (index != rand) {
      result[index] = result[rand];
    }
    result[rand] = collection[index];
  }
  return result;
}

module.exports = shuffle;

},{"../internal/baseRandom":"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/internal/baseRandom.js","../internal/toIterable":"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/internal/toIterable.js"}],"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/internal/arrayEvery.js":[function(require,module,exports){
/**
 * A specialized version of `_.every` for arrays without support for callback
 * shorthands and `this` binding.
 *
 * @private
 * @param {Array} array The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {boolean} Returns `true` if all elements pass the predicate check,
 *  else `false`.
 */
function arrayEvery(array, predicate) {
  var index = -1,
      length = array.length;

  while (++index < length) {
    if (!predicate(array[index], index, array)) {
      return false;
    }
  }
  return true;
}

module.exports = arrayEvery;

},{}],"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/internal/baseCallback.js":[function(require,module,exports){
var baseMatches = require('./baseMatches'),
    baseMatchesProperty = require('./baseMatchesProperty'),
    bindCallback = require('./bindCallback'),
    identity = require('../utility/identity'),
    property = require('../utility/property');

/**
 * The base implementation of `_.callback` which supports specifying the
 * number of arguments to provide to `func`.
 *
 * @private
 * @param {*} [func=_.identity] The value to convert to a callback.
 * @param {*} [thisArg] The `this` binding of `func`.
 * @param {number} [argCount] The number of arguments to provide to `func`.
 * @returns {Function} Returns the callback.
 */
function baseCallback(func, thisArg, argCount) {
  var type = typeof func;
  if (type == 'function') {
    return thisArg === undefined
      ? func
      : bindCallback(func, thisArg, argCount);
  }
  if (func == null) {
    return identity;
  }
  if (type == 'object') {
    return baseMatches(func);
  }
  return thisArg === undefined
    ? property(func)
    : baseMatchesProperty(func, thisArg);
}

module.exports = baseCallback;

},{"../utility/identity":"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/utility/identity.js","../utility/property":"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/utility/property.js","./baseMatches":"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/internal/baseMatches.js","./baseMatchesProperty":"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/internal/baseMatchesProperty.js","./bindCallback":"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/internal/bindCallback.js"}],"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/internal/baseEach.js":[function(require,module,exports){
var baseForOwn = require('./baseForOwn'),
    createBaseEach = require('./createBaseEach');

/**
 * The base implementation of `_.forEach` without support for callback
 * shorthands and `this` binding.
 *
 * @private
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array|Object|string} Returns `collection`.
 */
var baseEach = createBaseEach(baseForOwn);

module.exports = baseEach;

},{"./baseForOwn":"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/internal/baseForOwn.js","./createBaseEach":"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/internal/createBaseEach.js"}],"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/internal/baseEvery.js":[function(require,module,exports){
var baseEach = require('./baseEach');

/**
 * The base implementation of `_.every` without support for callback
 * shorthands and `this` binding.
 *
 * @private
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {boolean} Returns `true` if all elements pass the predicate check,
 *  else `false`
 */
function baseEvery(collection, predicate) {
  var result = true;
  baseEach(collection, function(value, index, collection) {
    result = !!predicate(value, index, collection);
    return result;
  });
  return result;
}

module.exports = baseEvery;

},{"./baseEach":"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/internal/baseEach.js"}],"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/internal/baseFor.js":[function(require,module,exports){
var createBaseFor = require('./createBaseFor');

/**
 * The base implementation of `baseForIn` and `baseForOwn` which iterates
 * over `object` properties returned by `keysFunc` invoking `iteratee` for
 * each property. Iteratee functions may exit iteration early by explicitly
 * returning `false`.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @returns {Object} Returns `object`.
 */
var baseFor = createBaseFor();

module.exports = baseFor;

},{"./createBaseFor":"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/internal/createBaseFor.js"}],"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/internal/baseForOwn.js":[function(require,module,exports){
var baseFor = require('./baseFor'),
    keys = require('../object/keys');

/**
 * The base implementation of `_.forOwn` without support for callback
 * shorthands and `this` binding.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Object} Returns `object`.
 */
function baseForOwn(object, iteratee) {
  return baseFor(object, iteratee, keys);
}

module.exports = baseForOwn;

},{"../object/keys":"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/object/keys.js","./baseFor":"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/internal/baseFor.js"}],"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/internal/baseGet.js":[function(require,module,exports){
var toObject = require('./toObject');

/**
 * The base implementation of `get` without support for string paths
 * and default values.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array} path The path of the property to get.
 * @param {string} [pathKey] The key representation of path.
 * @returns {*} Returns the resolved value.
 */
function baseGet(object, path, pathKey) {
  if (object == null) {
    return;
  }
  if (pathKey !== undefined && pathKey in toObject(object)) {
    path = [pathKey];
  }
  var index = -1,
      length = path.length;

  while (object != null && ++index < length) {
    object = object[path[index]];
  }
  return (index && index == length) ? object : undefined;
}

module.exports = baseGet;

},{"./toObject":"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/internal/toObject.js"}],"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/internal/baseIsEqual.js":[function(require,module,exports){
var baseIsEqualDeep = require('./baseIsEqualDeep');

/**
 * The base implementation of `_.isEqual` without support for `this` binding
 * `customizer` functions.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @param {Function} [customizer] The function to customize comparing values.
 * @param {boolean} [isLoose] Specify performing partial comparisons.
 * @param {Array} [stackA] Tracks traversed `value` objects.
 * @param {Array} [stackB] Tracks traversed `other` objects.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 */
function baseIsEqual(value, other, customizer, isLoose, stackA, stackB) {
  // Exit early for identical values.
  if (value === other) {
    return true;
  }
  var valType = typeof value,
      othType = typeof other;

  // Exit early for unlike primitive values.
  if ((valType != 'function' && valType != 'object' && othType != 'function' && othType != 'object') ||
      value == null || other == null) {
    // Return `false` unless both values are `NaN`.
    return value !== value && other !== other;
  }
  return baseIsEqualDeep(value, other, baseIsEqual, customizer, isLoose, stackA, stackB);
}

module.exports = baseIsEqual;

},{"./baseIsEqualDeep":"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/internal/baseIsEqualDeep.js"}],"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/internal/baseIsEqualDeep.js":[function(require,module,exports){
var equalArrays = require('./equalArrays'),
    equalByTag = require('./equalByTag'),
    equalObjects = require('./equalObjects'),
    isArray = require('../lang/isArray'),
    isTypedArray = require('../lang/isTypedArray');

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    objectTag = '[object Object]';

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the [`toStringTag`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.prototype.tostring)
 * of values.
 */
var objToString = objectProto.toString;

/**
 * A specialized version of `baseIsEqual` for arrays and objects which performs
 * deep comparisons and tracks traversed objects enabling objects with circular
 * references to be compared.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Function} [customizer] The function to customize comparing objects.
 * @param {boolean} [isLoose] Specify performing partial comparisons.
 * @param {Array} [stackA=[]] Tracks traversed `value` objects.
 * @param {Array} [stackB=[]] Tracks traversed `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function baseIsEqualDeep(object, other, equalFunc, customizer, isLoose, stackA, stackB) {
  var objIsArr = isArray(object),
      othIsArr = isArray(other),
      objTag = arrayTag,
      othTag = arrayTag;

  if (!objIsArr) {
    objTag = objToString.call(object);
    if (objTag == argsTag) {
      objTag = objectTag;
    } else if (objTag != objectTag) {
      objIsArr = isTypedArray(object);
    }
  }
  if (!othIsArr) {
    othTag = objToString.call(other);
    if (othTag == argsTag) {
      othTag = objectTag;
    } else if (othTag != objectTag) {
      othIsArr = isTypedArray(other);
    }
  }
  var objIsObj = objTag == objectTag,
      othIsObj = othTag == objectTag,
      isSameTag = objTag == othTag;

  if (isSameTag && !(objIsArr || objIsObj)) {
    return equalByTag(object, other, objTag);
  }
  if (!isLoose) {
    var valWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
        othWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

    if (valWrapped || othWrapped) {
      return equalFunc(valWrapped ? object.value() : object, othWrapped ? other.value() : other, customizer, isLoose, stackA, stackB);
    }
  }
  if (!isSameTag) {
    return false;
  }
  // Assume cyclic values are equal.
  // For more information on detecting circular references see https://es5.github.io/#JO.
  stackA || (stackA = []);
  stackB || (stackB = []);

  var length = stackA.length;
  while (length--) {
    if (stackA[length] == object) {
      return stackB[length] == other;
    }
  }
  // Add `object` and `other` to the stack of traversed objects.
  stackA.push(object);
  stackB.push(other);

  var result = (objIsArr ? equalArrays : equalObjects)(object, other, equalFunc, customizer, isLoose, stackA, stackB);

  stackA.pop();
  stackB.pop();

  return result;
}

module.exports = baseIsEqualDeep;

},{"../lang/isArray":"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/lang/isArray.js","../lang/isTypedArray":"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/lang/isTypedArray.js","./equalArrays":"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/internal/equalArrays.js","./equalByTag":"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/internal/equalByTag.js","./equalObjects":"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/internal/equalObjects.js"}],"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/internal/baseIsMatch.js":[function(require,module,exports){
var baseIsEqual = require('./baseIsEqual');

/**
 * The base implementation of `_.isMatch` without support for callback
 * shorthands and `this` binding.
 *
 * @private
 * @param {Object} object The object to inspect.
 * @param {Array} props The source property names to match.
 * @param {Array} values The source values to match.
 * @param {Array} strictCompareFlags Strict comparison flags for source values.
 * @param {Function} [customizer] The function to customize comparing objects.
 * @returns {boolean} Returns `true` if `object` is a match, else `false`.
 */
function baseIsMatch(object, props, values, strictCompareFlags, customizer) {
  var index = -1,
      length = props.length,
      noCustomizer = !customizer;

  while (++index < length) {
    if ((noCustomizer && strictCompareFlags[index])
          ? values[index] !== object[props[index]]
          : !(props[index] in object)
        ) {
      return false;
    }
  }
  index = -1;
  while (++index < length) {
    var key = props[index],
        objValue = object[key],
        srcValue = values[index];

    if (noCustomizer && strictCompareFlags[index]) {
      var result = objValue !== undefined || (key in object);
    } else {
      result = customizer ? customizer(objValue, srcValue, key) : undefined;
      if (result === undefined) {
        result = baseIsEqual(srcValue, objValue, customizer, true);
      }
    }
    if (!result) {
      return false;
    }
  }
  return true;
}

module.exports = baseIsMatch;

},{"./baseIsEqual":"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/internal/baseIsEqual.js"}],"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/internal/baseMatches.js":[function(require,module,exports){
var baseIsMatch = require('./baseIsMatch'),
    constant = require('../utility/constant'),
    isStrictComparable = require('./isStrictComparable'),
    keys = require('../object/keys'),
    toObject = require('./toObject');

/**
 * The base implementation of `_.matches` which does not clone `source`.
 *
 * @private
 * @param {Object} source The object of property values to match.
 * @returns {Function} Returns the new function.
 */
function baseMatches(source) {
  var props = keys(source),
      length = props.length;

  if (!length) {
    return constant(true);
  }
  if (length == 1) {
    var key = props[0],
        value = source[key];

    if (isStrictComparable(value)) {
      return function(object) {
        if (object == null) {
          return false;
        }
        return object[key] === value && (value !== undefined || (key in toObject(object)));
      };
    }
  }
  var values = Array(length),
      strictCompareFlags = Array(length);

  while (length--) {
    value = source[props[length]];
    values[length] = value;
    strictCompareFlags[length] = isStrictComparable(value);
  }
  return function(object) {
    return object != null && baseIsMatch(toObject(object), props, values, strictCompareFlags);
  };
}

module.exports = baseMatches;

},{"../object/keys":"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/object/keys.js","../utility/constant":"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/utility/constant.js","./baseIsMatch":"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/internal/baseIsMatch.js","./isStrictComparable":"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/internal/isStrictComparable.js","./toObject":"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/internal/toObject.js"}],"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/internal/baseMatchesProperty.js":[function(require,module,exports){
var baseGet = require('./baseGet'),
    baseIsEqual = require('./baseIsEqual'),
    baseSlice = require('./baseSlice'),
    isArray = require('../lang/isArray'),
    isKey = require('./isKey'),
    isStrictComparable = require('./isStrictComparable'),
    last = require('../array/last'),
    toObject = require('./toObject'),
    toPath = require('./toPath');

/**
 * The base implementation of `_.matchesProperty` which does not which does
 * not clone `value`.
 *
 * @private
 * @param {string} path The path of the property to get.
 * @param {*} value The value to compare.
 * @returns {Function} Returns the new function.
 */
function baseMatchesProperty(path, value) {
  var isArr = isArray(path),
      isCommon = isKey(path) && isStrictComparable(value),
      pathKey = (path + '');

  path = toPath(path);
  return function(object) {
    if (object == null) {
      return false;
    }
    var key = pathKey;
    object = toObject(object);
    if ((isArr || !isCommon) && !(key in object)) {
      object = path.length == 1 ? object : baseGet(object, baseSlice(path, 0, -1));
      if (object == null) {
        return false;
      }
      key = last(path);
      object = toObject(object);
    }
    return object[key] === value
      ? (value !== undefined || (key in object))
      : baseIsEqual(value, object[key], null, true);
  };
}

module.exports = baseMatchesProperty;

},{"../array/last":"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/array/last.js","../lang/isArray":"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/lang/isArray.js","./baseGet":"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/internal/baseGet.js","./baseIsEqual":"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/internal/baseIsEqual.js","./baseSlice":"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/internal/baseSlice.js","./isKey":"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/internal/isKey.js","./isStrictComparable":"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/internal/isStrictComparable.js","./toObject":"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/internal/toObject.js","./toPath":"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/internal/toPath.js"}],"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/internal/baseProperty.js":[function(require,module,exports){
/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new function.
 */
function baseProperty(key) {
  return function(object) {
    return object == null ? undefined : object[key];
  };
}

module.exports = baseProperty;

},{}],"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/internal/basePropertyDeep.js":[function(require,module,exports){
var baseGet = require('./baseGet'),
    toPath = require('./toPath');

/**
 * A specialized version of `baseProperty` which supports deep paths.
 *
 * @private
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new function.
 */
function basePropertyDeep(path) {
  var pathKey = (path + '');
  path = toPath(path);
  return function(object) {
    return baseGet(object, path, pathKey);
  };
}

module.exports = basePropertyDeep;

},{"./baseGet":"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/internal/baseGet.js","./toPath":"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/internal/toPath.js"}],"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/internal/baseRandom.js":[function(require,module,exports){
/** Native method references. */
var floor = Math.floor;

/* Native method references for those with the same name as other `lodash` methods. */
var nativeRandom = Math.random;

/**
 * The base implementation of `_.random` without support for argument juggling
 * and returning floating-point numbers.
 *
 * @private
 * @param {number} min The minimum possible value.
 * @param {number} max The maximum possible value.
 * @returns {number} Returns the random number.
 */
function baseRandom(min, max) {
  return min + floor(nativeRandom() * (max - min + 1));
}

module.exports = baseRandom;

},{}],"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/internal/baseSlice.js":[function(require,module,exports){
/**
 * The base implementation of `_.slice` without an iteratee call guard.
 *
 * @private
 * @param {Array} array The array to slice.
 * @param {number} [start=0] The start position.
 * @param {number} [end=array.length] The end position.
 * @returns {Array} Returns the slice of `array`.
 */
function baseSlice(array, start, end) {
  var index = -1,
      length = array.length;

  start = start == null ? 0 : (+start || 0);
  if (start < 0) {
    start = -start > length ? 0 : (length + start);
  }
  end = (end === undefined || end > length) ? length : (+end || 0);
  if (end < 0) {
    end += length;
  }
  length = start > end ? 0 : ((end - start) >>> 0);
  start >>>= 0;

  var result = Array(length);
  while (++index < length) {
    result[index] = array[index + start];
  }
  return result;
}

module.exports = baseSlice;

},{}],"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/internal/baseToString.js":[function(require,module,exports){
/**
 * Converts `value` to a string if it is not one. An empty string is returned
 * for `null` or `undefined` values.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  if (typeof value == 'string') {
    return value;
  }
  return value == null ? '' : (value + '');
}

module.exports = baseToString;

},{}],"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/internal/baseValues.js":[function(require,module,exports){
/**
 * The base implementation of `_.values` and `_.valuesIn` which creates an
 * array of `object` property values corresponding to the property names
 * of `props`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array} props The property names to get values for.
 * @returns {Object} Returns the array of property values.
 */
function baseValues(object, props) {
  var index = -1,
      length = props.length,
      result = Array(length);

  while (++index < length) {
    result[index] = object[props[index]];
  }
  return result;
}

module.exports = baseValues;

},{}],"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/internal/bindCallback.js":[function(require,module,exports){
var identity = require('../utility/identity');

/**
 * A specialized version of `baseCallback` which only supports `this` binding
 * and specifying the number of arguments to provide to `func`.
 *
 * @private
 * @param {Function} func The function to bind.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {number} [argCount] The number of arguments to provide to `func`.
 * @returns {Function} Returns the callback.
 */
function bindCallback(func, thisArg, argCount) {
  if (typeof func != 'function') {
    return identity;
  }
  if (thisArg === undefined) {
    return func;
  }
  switch (argCount) {
    case 1: return function(value) {
      return func.call(thisArg, value);
    };
    case 3: return function(value, index, collection) {
      return func.call(thisArg, value, index, collection);
    };
    case 4: return function(accumulator, value, index, collection) {
      return func.call(thisArg, accumulator, value, index, collection);
    };
    case 5: return function(value, other, key, object, source) {
      return func.call(thisArg, value, other, key, object, source);
    };
  }
  return function() {
    return func.apply(thisArg, arguments);
  };
}

module.exports = bindCallback;

},{"../utility/identity":"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/utility/identity.js"}],"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/internal/createBaseEach.js":[function(require,module,exports){
var getLength = require('./getLength'),
    isLength = require('./isLength'),
    toObject = require('./toObject');

/**
 * Creates a `baseEach` or `baseEachRight` function.
 *
 * @private
 * @param {Function} eachFunc The function to iterate over a collection.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseEach(eachFunc, fromRight) {
  return function(collection, iteratee) {
    var length = collection ? getLength(collection) : 0;
    if (!isLength(length)) {
      return eachFunc(collection, iteratee);
    }
    var index = fromRight ? length : -1,
        iterable = toObject(collection);

    while ((fromRight ? index-- : ++index < length)) {
      if (iteratee(iterable[index], index, iterable) === false) {
        break;
      }
    }
    return collection;
  };
}

module.exports = createBaseEach;

},{"./getLength":"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/internal/getLength.js","./isLength":"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/internal/isLength.js","./toObject":"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/internal/toObject.js"}],"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/internal/createBaseFor.js":[function(require,module,exports){
var toObject = require('./toObject');

/**
 * Creates a base function for `_.forIn` or `_.forInRight`.
 *
 * @private
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseFor(fromRight) {
  return function(object, iteratee, keysFunc) {
    var iterable = toObject(object),
        props = keysFunc(object),
        length = props.length,
        index = fromRight ? length : -1;

    while ((fromRight ? index-- : ++index < length)) {
      var key = props[index];
      if (iteratee(iterable[key], key, iterable) === false) {
        break;
      }
    }
    return object;
  };
}

module.exports = createBaseFor;

},{"./toObject":"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/internal/toObject.js"}],"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/internal/equalArrays.js":[function(require,module,exports){
/**
 * A specialized version of `baseIsEqualDeep` for arrays with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Array} array The array to compare.
 * @param {Array} other The other array to compare.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Function} [customizer] The function to customize comparing arrays.
 * @param {boolean} [isLoose] Specify performing partial comparisons.
 * @param {Array} [stackA] Tracks traversed `value` objects.
 * @param {Array} [stackB] Tracks traversed `other` objects.
 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
 */
function equalArrays(array, other, equalFunc, customizer, isLoose, stackA, stackB) {
  var index = -1,
      arrLength = array.length,
      othLength = other.length,
      result = true;

  if (arrLength != othLength && !(isLoose && othLength > arrLength)) {
    return false;
  }
  // Deep compare the contents, ignoring non-numeric properties.
  while (result && ++index < arrLength) {
    var arrValue = array[index],
        othValue = other[index];

    result = undefined;
    if (customizer) {
      result = isLoose
        ? customizer(othValue, arrValue, index)
        : customizer(arrValue, othValue, index);
    }
    if (result === undefined) {
      // Recursively compare arrays (susceptible to call stack limits).
      if (isLoose) {
        var othIndex = othLength;
        while (othIndex--) {
          othValue = other[othIndex];
          result = (arrValue && arrValue === othValue) || equalFunc(arrValue, othValue, customizer, isLoose, stackA, stackB);
          if (result) {
            break;
          }
        }
      } else {
        result = (arrValue && arrValue === othValue) || equalFunc(arrValue, othValue, customizer, isLoose, stackA, stackB);
      }
    }
  }
  return !!result;
}

module.exports = equalArrays;

},{}],"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/internal/equalByTag.js":[function(require,module,exports){
/** `Object#toString` result references. */
var boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    numberTag = '[object Number]',
    regexpTag = '[object RegExp]',
    stringTag = '[object String]';

/**
 * A specialized version of `baseIsEqualDeep` for comparing objects of
 * the same `toStringTag`.
 *
 * **Note:** This function only supports comparing values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} value The object to compare.
 * @param {Object} other The other object to compare.
 * @param {string} tag The `toStringTag` of the objects to compare.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalByTag(object, other, tag) {
  switch (tag) {
    case boolTag:
    case dateTag:
      // Coerce dates and booleans to numbers, dates to milliseconds and booleans
      // to `1` or `0` treating invalid dates coerced to `NaN` as not equal.
      return +object == +other;

    case errorTag:
      return object.name == other.name && object.message == other.message;

    case numberTag:
      // Treat `NaN` vs. `NaN` as equal.
      return (object != +object)
        ? other != +other
        : object == +other;

    case regexpTag:
    case stringTag:
      // Coerce regexes to strings and treat strings primitives and string
      // objects as equal. See https://es5.github.io/#x15.10.6.4 for more details.
      return object == (other + '');
  }
  return false;
}

module.exports = equalByTag;

},{}],"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/internal/equalObjects.js":[function(require,module,exports){
var keys = require('../object/keys');

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * A specialized version of `baseIsEqualDeep` for objects with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Function} [customizer] The function to customize comparing values.
 * @param {boolean} [isLoose] Specify performing partial comparisons.
 * @param {Array} [stackA] Tracks traversed `value` objects.
 * @param {Array} [stackB] Tracks traversed `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalObjects(object, other, equalFunc, customizer, isLoose, stackA, stackB) {
  var objProps = keys(object),
      objLength = objProps.length,
      othProps = keys(other),
      othLength = othProps.length;

  if (objLength != othLength && !isLoose) {
    return false;
  }
  var skipCtor = isLoose,
      index = -1;

  while (++index < objLength) {
    var key = objProps[index],
        result = isLoose ? key in other : hasOwnProperty.call(other, key);

    if (result) {
      var objValue = object[key],
          othValue = other[key];

      result = undefined;
      if (customizer) {
        result = isLoose
          ? customizer(othValue, objValue, key)
          : customizer(objValue, othValue, key);
      }
      if (result === undefined) {
        // Recursively compare objects (susceptible to call stack limits).
        result = (objValue && objValue === othValue) || equalFunc(objValue, othValue, customizer, isLoose, stackA, stackB);
      }
    }
    if (!result) {
      return false;
    }
    skipCtor || (skipCtor = key == 'constructor');
  }
  if (!skipCtor) {
    var objCtor = object.constructor,
        othCtor = other.constructor;

    // Non `Object` object instances with different constructors are not equal.
    if (objCtor != othCtor &&
        ('constructor' in object && 'constructor' in other) &&
        !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
          typeof othCtor == 'function' && othCtor instanceof othCtor)) {
      return false;
    }
  }
  return true;
}

module.exports = equalObjects;

},{"../object/keys":"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/object/keys.js"}],"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/internal/getLength.js":[function(require,module,exports){
var baseProperty = require('./baseProperty');

/**
 * Gets the "length" property value of `object`.
 *
 * **Note:** This function is used to avoid a [JIT bug](https://bugs.webkit.org/show_bug.cgi?id=142792)
 * that affects Safari on at least iOS 8.1-8.3 ARM64.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {*} Returns the "length" value.
 */
var getLength = baseProperty('length');

module.exports = getLength;

},{"./baseProperty":"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/internal/baseProperty.js"}],"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/internal/isArrayLike.js":[function(require,module,exports){
var getLength = require('./getLength'),
    isLength = require('./isLength');

/**
 * Checks if `value` is array-like.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 */
function isArrayLike(value) {
  return value != null && isLength(getLength(value));
}

module.exports = isArrayLike;

},{"./getLength":"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/internal/getLength.js","./isLength":"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/internal/isLength.js"}],"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/internal/isIndex.js":[function(require,module,exports){
/**
 * Used as the [maximum length](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-number.max_safe_integer)
 * of an array-like value.
 */
var MAX_SAFE_INTEGER = Math.pow(2, 53) - 1;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  value = +value;
  length = length == null ? MAX_SAFE_INTEGER : length;
  return value > -1 && value % 1 == 0 && value < length;
}

module.exports = isIndex;

},{}],"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/internal/isIterateeCall.js":[function(require,module,exports){
var isArrayLike = require('./isArrayLike'),
    isIndex = require('./isIndex'),
    isObject = require('../lang/isObject');

/**
 * Checks if the provided arguments are from an iteratee call.
 *
 * @private
 * @param {*} value The potential iteratee value argument.
 * @param {*} index The potential iteratee index or key argument.
 * @param {*} object The potential iteratee object argument.
 * @returns {boolean} Returns `true` if the arguments are from an iteratee call, else `false`.
 */
function isIterateeCall(value, index, object) {
  if (!isObject(object)) {
    return false;
  }
  var type = typeof index;
  if (type == 'number'
      ? (isArrayLike(object) && isIndex(index, object.length))
      : (type == 'string' && index in object)) {
    var other = object[index];
    return value === value ? (value === other) : (other !== other);
  }
  return false;
}

module.exports = isIterateeCall;

},{"../lang/isObject":"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/lang/isObject.js","./isArrayLike":"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/internal/isArrayLike.js","./isIndex":"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/internal/isIndex.js"}],"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/internal/isKey.js":[function(require,module,exports){
var isArray = require('../lang/isArray'),
    toObject = require('./toObject');

/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\n\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/;

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey(value, object) {
  var type = typeof value;
  if ((type == 'string' && reIsPlainProp.test(value)) || type == 'number') {
    return true;
  }
  if (isArray(value)) {
    return false;
  }
  var result = !reIsDeepProp.test(value);
  return result || (object != null && value in toObject(object));
}

module.exports = isKey;

},{"../lang/isArray":"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/lang/isArray.js","./toObject":"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/internal/toObject.js"}],"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/internal/isLength.js":[function(require,module,exports){
/**
 * Used as the [maximum length](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-number.max_safe_integer)
 * of an array-like value.
 */
var MAX_SAFE_INTEGER = Math.pow(2, 53) - 1;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This function is based on [`ToLength`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength).
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 */
function isLength(value) {
  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

module.exports = isLength;

},{}],"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/internal/isObjectLike.js":[function(require,module,exports){
/**
 * Checks if `value` is object-like.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

module.exports = isObjectLike;

},{}],"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/internal/isStrictComparable.js":[function(require,module,exports){
var isObject = require('../lang/isObject');

/**
 * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` if suitable for strict
 *  equality comparisons, else `false`.
 */
function isStrictComparable(value) {
  return value === value && !isObject(value);
}

module.exports = isStrictComparable;

},{"../lang/isObject":"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/lang/isObject.js"}],"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/internal/shimKeys.js":[function(require,module,exports){
var isArguments = require('../lang/isArguments'),
    isArray = require('../lang/isArray'),
    isIndex = require('./isIndex'),
    isLength = require('./isLength'),
    keysIn = require('../object/keysIn'),
    support = require('../support');

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * A fallback implementation of `Object.keys` which creates an array of the
 * own enumerable property names of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function shimKeys(object) {
  var props = keysIn(object),
      propsLength = props.length,
      length = propsLength && object.length;

  var allowIndexes = length && isLength(length) &&
    (isArray(object) || (support.nonEnumArgs && isArguments(object)));

  var index = -1,
      result = [];

  while (++index < propsLength) {
    var key = props[index];
    if ((allowIndexes && isIndex(key, length)) || hasOwnProperty.call(object, key)) {
      result.push(key);
    }
  }
  return result;
}

module.exports = shimKeys;

},{"../lang/isArguments":"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/lang/isArguments.js","../lang/isArray":"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/lang/isArray.js","../object/keysIn":"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/object/keysIn.js","../support":"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/support.js","./isIndex":"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/internal/isIndex.js","./isLength":"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/internal/isLength.js"}],"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/internal/toIterable.js":[function(require,module,exports){
var isArrayLike = require('./isArrayLike'),
    isObject = require('../lang/isObject'),
    values = require('../object/values');

/**
 * Converts `value` to an array-like object if it is not one.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {Array|Object} Returns the array-like object.
 */
function toIterable(value) {
  if (value == null) {
    return [];
  }
  if (!isArrayLike(value)) {
    return values(value);
  }
  return isObject(value) ? value : Object(value);
}

module.exports = toIterable;

},{"../lang/isObject":"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/lang/isObject.js","../object/values":"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/object/values.js","./isArrayLike":"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/internal/isArrayLike.js"}],"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/internal/toObject.js":[function(require,module,exports){
var isObject = require('../lang/isObject');

/**
 * Converts `value` to an object if it is not one.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {Object} Returns the object.
 */
function toObject(value) {
  return isObject(value) ? value : Object(value);
}

module.exports = toObject;

},{"../lang/isObject":"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/lang/isObject.js"}],"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/internal/toPath.js":[function(require,module,exports){
var baseToString = require('./baseToString'),
    isArray = require('../lang/isArray');

/** Used to match property names within property paths. */
var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\n\\]|\\.)*?)\2)\]/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/**
 * Converts `value` to property path array if it is not one.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {Array} Returns the property path array.
 */
function toPath(value) {
  if (isArray(value)) {
    return value;
  }
  var result = [];
  baseToString(value).replace(rePropName, function(match, number, quote, string) {
    result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
  });
  return result;
}

module.exports = toPath;

},{"../lang/isArray":"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/lang/isArray.js","./baseToString":"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/internal/baseToString.js"}],"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/lang/isArguments.js":[function(require,module,exports){
var isArrayLike = require('../internal/isArrayLike'),
    isObjectLike = require('../internal/isObjectLike');

/** `Object#toString` result references. */
var argsTag = '[object Arguments]';

/** Used for native method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the [`toStringTag`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.prototype.tostring)
 * of values.
 */
var objToString = objectProto.toString;

/**
 * Checks if `value` is classified as an `arguments` object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
function isArguments(value) {
  return isObjectLike(value) && isArrayLike(value) && objToString.call(value) == argsTag;
}

module.exports = isArguments;

},{"../internal/isArrayLike":"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/internal/isArrayLike.js","../internal/isObjectLike":"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/internal/isObjectLike.js"}],"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/lang/isArray.js":[function(require,module,exports){
var isLength = require('../internal/isLength'),
    isNative = require('./isNative'),
    isObjectLike = require('../internal/isObjectLike');

/** `Object#toString` result references. */
var arrayTag = '[object Array]';

/** Used for native method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the [`toStringTag`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.prototype.tostring)
 * of values.
 */
var objToString = objectProto.toString;

/* Native method references for those with the same name as other `lodash` methods. */
var nativeIsArray = isNative(nativeIsArray = Array.isArray) && nativeIsArray;

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(function() { return arguments; }());
 * // => false
 */
var isArray = nativeIsArray || function(value) {
  return isObjectLike(value) && isLength(value.length) && objToString.call(value) == arrayTag;
};

module.exports = isArray;

},{"../internal/isLength":"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/internal/isLength.js","../internal/isObjectLike":"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/internal/isObjectLike.js","./isNative":"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/lang/isNative.js"}],"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/lang/isNative.js":[function(require,module,exports){
var escapeRegExp = require('../string/escapeRegExp'),
    isObjectLike = require('../internal/isObjectLike');

/** `Object#toString` result references. */
var funcTag = '[object Function]';

/** Used to detect host constructors (Safari > 5). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var fnToString = Function.prototype.toString;

/**
 * Used to resolve the [`toStringTag`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.prototype.tostring)
 * of values.
 */
var objToString = objectProto.toString;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  escapeRegExp(objToString)
  .replace(/toString|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * Checks if `value` is a native function.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function, else `false`.
 * @example
 *
 * _.isNative(Array.prototype.push);
 * // => true
 *
 * _.isNative(_);
 * // => false
 */
function isNative(value) {
  if (value == null) {
    return false;
  }
  if (objToString.call(value) == funcTag) {
    return reIsNative.test(fnToString.call(value));
  }
  return isObjectLike(value) && reIsHostCtor.test(value);
}

module.exports = isNative;

},{"../internal/isObjectLike":"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/internal/isObjectLike.js","../string/escapeRegExp":"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/string/escapeRegExp.js"}],"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/lang/isObject.js":[function(require,module,exports){
/**
 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(1);
 * // => false
 */
function isObject(value) {
  // Avoid a V8 JIT bug in Chrome 19-20.
  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
  var type = typeof value;
  return type == 'function' || (!!value && type == 'object');
}

module.exports = isObject;

},{}],"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/lang/isTypedArray.js":[function(require,module,exports){
var isLength = require('../internal/isLength'),
    isObjectLike = require('../internal/isObjectLike');

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dateTag] = typedArrayTags[errorTag] =
typedArrayTags[funcTag] = typedArrayTags[mapTag] =
typedArrayTags[numberTag] = typedArrayTags[objectTag] =
typedArrayTags[regexpTag] = typedArrayTags[setTag] =
typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;

/** Used for native method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the [`toStringTag`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.prototype.tostring)
 * of values.
 */
var objToString = objectProto.toString;

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
function isTypedArray(value) {
  return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[objToString.call(value)];
}

module.exports = isTypedArray;

},{"../internal/isLength":"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/internal/isLength.js","../internal/isObjectLike":"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/internal/isObjectLike.js"}],"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/object/keys.js":[function(require,module,exports){
var isArrayLike = require('../internal/isArrayLike'),
    isNative = require('../lang/isNative'),
    isObject = require('../lang/isObject'),
    shimKeys = require('../internal/shimKeys');

/* Native method references for those with the same name as other `lodash` methods. */
var nativeKeys = isNative(nativeKeys = Object.keys) && nativeKeys;

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.keys)
 * for more details.
 *
 * @static
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
var keys = !nativeKeys ? shimKeys : function(object) {
  var Ctor = object != null && object.constructor;
  if ((typeof Ctor == 'function' && Ctor.prototype === object) ||
      (typeof object != 'function' && isArrayLike(object))) {
    return shimKeys(object);
  }
  return isObject(object) ? nativeKeys(object) : [];
};

module.exports = keys;

},{"../internal/isArrayLike":"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/internal/isArrayLike.js","../internal/shimKeys":"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/internal/shimKeys.js","../lang/isNative":"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/lang/isNative.js","../lang/isObject":"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/lang/isObject.js"}],"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/object/keysIn.js":[function(require,module,exports){
var isArguments = require('../lang/isArguments'),
    isArray = require('../lang/isArray'),
    isIndex = require('../internal/isIndex'),
    isLength = require('../internal/isLength'),
    isObject = require('../lang/isObject'),
    support = require('../support');

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Creates an array of the own and inherited enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keysIn(new Foo);
 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
 */
function keysIn(object) {
  if (object == null) {
    return [];
  }
  if (!isObject(object)) {
    object = Object(object);
  }
  var length = object.length;
  length = (length && isLength(length) &&
    (isArray(object) || (support.nonEnumArgs && isArguments(object))) && length) || 0;

  var Ctor = object.constructor,
      index = -1,
      isProto = typeof Ctor == 'function' && Ctor.prototype === object,
      result = Array(length),
      skipIndexes = length > 0;

  while (++index < length) {
    result[index] = (index + '');
  }
  for (var key in object) {
    if (!(skipIndexes && isIndex(key, length)) &&
        !(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}

module.exports = keysIn;

},{"../internal/isIndex":"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/internal/isIndex.js","../internal/isLength":"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/internal/isLength.js","../lang/isArguments":"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/lang/isArguments.js","../lang/isArray":"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/lang/isArray.js","../lang/isObject":"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/lang/isObject.js","../support":"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/support.js"}],"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/object/values.js":[function(require,module,exports){
var baseValues = require('../internal/baseValues'),
    keys = require('./keys');

/**
 * Creates an array of the own enumerable property values of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property values.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.values(new Foo);
 * // => [1, 2] (iteration order is not guaranteed)
 *
 * _.values('hi');
 * // => ['h', 'i']
 */
function values(object) {
  return baseValues(object, keys(object));
}

module.exports = values;

},{"../internal/baseValues":"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/internal/baseValues.js","./keys":"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/object/keys.js"}],"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/string/escapeRegExp.js":[function(require,module,exports){
var baseToString = require('../internal/baseToString');

/**
 * Used to match `RegExp` [special characters](http://www.regular-expressions.info/characters.html#special).
 * In addition to special characters the forward slash is escaped to allow for
 * easier `eval` use and `Function` compilation.
 */
var reRegExpChars = /[.*+?^${}()|[\]\/\\]/g,
    reHasRegExpChars = RegExp(reRegExpChars.source);

/**
 * Escapes the `RegExp` special characters "\", "/", "^", "$", ".", "|", "?",
 * "*", "+", "(", ")", "[", "]", "{" and "}" in `string`.
 *
 * @static
 * @memberOf _
 * @category String
 * @param {string} [string=''] The string to escape.
 * @returns {string} Returns the escaped string.
 * @example
 *
 * _.escapeRegExp('[lodash](https://lodash.com/)');
 * // => '\[lodash\]\(https:\/\/lodash\.com\/\)'
 */
function escapeRegExp(string) {
  string = baseToString(string);
  return (string && reHasRegExpChars.test(string))
    ? string.replace(reRegExpChars, '\\$&')
    : string;
}

module.exports = escapeRegExp;

},{"../internal/baseToString":"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/internal/baseToString.js"}],"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/support.js":[function(require,module,exports){
(function (global){
/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to detect DOM support. */
var document = (document = global.window) && document.document;

/** Native method references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/**
 * An object environment feature flags.
 *
 * @static
 * @memberOf _
 * @type Object
 */
var support = {};

(function(x) {
  var Ctor = function() { this.x = x; },
      args = arguments,
      object = { '0': x, 'length': x },
      props = [];

  Ctor.prototype = { 'valueOf': x, 'y': x };
  for (var key in new Ctor) { props.push(key); }

  /**
   * Detect if functions can be decompiled by `Function#toString`
   * (all but Firefox OS certified apps, older Opera mobile browsers, and
   * the PlayStation 3; forced `false` for Windows 8 apps).
   *
   * @memberOf _.support
   * @type boolean
   */
  support.funcDecomp = /\bthis\b/.test(function() { return this; });

  /**
   * Detect if `Function#name` is supported (all but IE).
   *
   * @memberOf _.support
   * @type boolean
   */
  support.funcNames = typeof Function.name == 'string';

  /**
   * Detect if the DOM is supported.
   *
   * @memberOf _.support
   * @type boolean
   */
  try {
    support.dom = document.createDocumentFragment().nodeType === 11;
  } catch(e) {
    support.dom = false;
  }

  /**
   * Detect if `arguments` object indexes are non-enumerable.
   *
   * In Firefox < 4, IE < 9, PhantomJS, and Safari < 5.1 `arguments` object
   * indexes are non-enumerable. Chrome < 25 and Node.js < 0.11.0 treat
   * `arguments` object indexes as non-enumerable and fail `hasOwnProperty`
   * checks for indexes that exceed the number of function parameters and
   * whose associated argument values are `0`.
   *
   * @memberOf _.support
   * @type boolean
   */
  try {
    support.nonEnumArgs = !propertyIsEnumerable.call(args, 1);
  } catch(e) {
    support.nonEnumArgs = true;
  }
}(1, 0));

module.exports = support;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/utility/constant.js":[function(require,module,exports){
/**
 * Creates a function that returns `value`.
 *
 * @static
 * @memberOf _
 * @category Utility
 * @param {*} value The value to return from the new function.
 * @returns {Function} Returns the new function.
 * @example
 *
 * var object = { 'user': 'fred' };
 * var getter = _.constant(object);
 *
 * getter() === object;
 * // => true
 */
function constant(value) {
  return function() {
    return value;
  };
}

module.exports = constant;

},{}],"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/utility/identity.js":[function(require,module,exports){
/**
 * This method returns the first argument provided to it.
 *
 * @static
 * @memberOf _
 * @category Utility
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'user': 'fred' };
 *
 * _.identity(object) === object;
 * // => true
 */
function identity(value) {
  return value;
}

module.exports = identity;

},{}],"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/utility/property.js":[function(require,module,exports){
var baseProperty = require('../internal/baseProperty'),
    basePropertyDeep = require('../internal/basePropertyDeep'),
    isKey = require('../internal/isKey');

/**
 * Creates a function which returns the property value at `path` on a
 * given object.
 *
 * @static
 * @memberOf _
 * @category Utility
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new function.
 * @example
 *
 * var objects = [
 *   { 'a': { 'b': { 'c': 2 } } },
 *   { 'a': { 'b': { 'c': 1 } } }
 * ];
 *
 * _.map(objects, _.property('a.b.c'));
 * // => [2, 1]
 *
 * _.pluck(_.sortBy(objects, _.property(['a', 'b', 'c'])), 'a.b.c');
 * // => [1, 2]
 */
function property(path) {
  return isKey(path) ? baseProperty(path) : basePropertyDeep(path);
}

module.exports = property;

},{"../internal/baseProperty":"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/internal/baseProperty.js","../internal/basePropertyDeep":"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/internal/basePropertyDeep.js","../internal/isKey":"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/internal/isKey.js"}],"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/sockception/lib/index.js":[function(require,module,exports){
(function (process){
"use strict";

var sockception

;(function(module, require){
    var ws = require("ws")

    sockception = module.exports

    sockception.impl = {}
    var impl = sockception.impl

    impl.idGen = function(prefix) {
        var count = 0
        return function() {
            return prefix + count++
        }
    }

    sockception.impl.initRoute = function(routes, routePath) {
        var ret = routes

        var i = 0
        var next

        while (i < routePath.length) {
            next = ret.children[routePath[i]]
            if (!next) {
                break
            }
            ret = next
            i++
        }

        while (i < routePath.length) {
            next = {children: {}}
            ret.children[routePath[i]] = next
            ret = next
            i++
        }

        ret.value = ret.value || {}
        ret = ret.value

        return ret
    }

    sockception.impl.getRoute = function(routes, routePath) {
        var ret = routes

        var i = 0
        var next

        while (i < routePath.length) {
            next = ret.children[routePath[i]]
            if (!next) {
                return undefined
            }
            ret = next
            i++
        }

        ret = ret.value

        return ret
    }

    sockception.impl.lazyCall = function(f) {
        var set = false
        var value
        return function() {
            if (set) {
                return value
            } else {
                return f()
            }
        }
    }

    sockception.fromPrefixAndTransport = function(prefix, transport, log) {
        log = log || {}
        log.debug = log.debug || function() {}
        log.info = log.info || function() {}
        log.error = log.error || function() {}

        var factory = {
            routes: {
                children: {}
            },
            idGen: impl.idGen(prefix),
            transport: transport,
            closeHandlers: [],
            create: function(routePath, value) {
                var socket = {
                    impl: {
                        factory: factory,
                        routePath: routePath,
                        route: sockception.impl.lazyCall(function() {
                            return sockception.impl.initRoute(factory.routes, routePath)
                        })
                    },
                    value: value,
                    send: function(value) {
                        var impl = socket.impl
                        var factory = impl.factory
                        var subsocket = factory.create([factory.idGen()], null)
                        var sendObj = [impl.routePath, subsocket.impl.routePath, value]
                        var sendStr = JSON.stringify(sendObj)
                        log.debug("Sending: " + sendStr)
                        factory.transport.send(sendStr)

                        return subsocket
                    },
                    receiveOne: function(cb) {
                        socket.impl.route().handler = function(s) {
                            cb(s)
                            delete socket.impl.route().handler // TODO: delete socket.impl.route() too
                        }
                    },
                    receiveMany: function(cb) {
                        socket.impl.route().handler = function(s) {
                            cb(s, function() {
                                delete socket.impl.route().handler // TODO: delete socket.impl.route() too
                            })
                        }
                    },
                    route: function(routeItem) { // TODO: should this be making duplicates of routes like this? should work fine...
                        var impl = socket.impl
                        var newRoutePath = impl.routePath.slice()
                        newRoutePath.push(routeItem)
                        return impl.factory.create(newRoutePath, null)
                    },
                    multiRoute: function(routeReceivers) { // TODO: test, multiRouteOne?
                        for (var routeItem in routeReceivers) {
                            socket.route(routeItem).receiveMany(routeReceivers[routeItem])
                        }
                    },
                    onclose: function(cb) {
                        socket.impl.factory.closeHandlers.push(cb)
                    }
                }

                return socket
            }
        }

        transport.receive(function(str) {
            log.debug("Received: " + str)
            var parsed = JSON.parse(str)

            var route = sockception.impl.getRoute(factory.routes, parsed[0])

            if (!route) {
                log.error("Route not set: " + JSON.stringify(parsed[0])) // TODO: inform other end?
                return
            }

            if (!route || !route.handler) {
                log.error("Route but no handler for: " + JSON.stringify(parsed[0])) // TODO: inform other end?
                return
            }

            route.handler(factory.create(parsed[1], parsed[2]))
        })

        var firstSock = factory.create(["0"], null)

        var closed = false

        firstSock.close = function() {
            if (!closed) {
                transport.close()
            }
        }

        transport.onclose(function() {
            closed = true
            factory.closeHandlers.forEach(function(handler) {
                handler()
            })
        })

        return firstSock
    }

    impl.transportPair = function() {
        var transports = {
            a: {
                impl: {
                    handler: function() {},
                    closeHandler: function() {}
                },
                send: function(msg) {
                    process.nextTick(function() { // TODO: browser compatibility
                        transports.b.impl.handler(msg)
                    })
                },
                close: function() {
                    process.nextTick(function() {
                        transports.a.impl.closeHandler()
                        transports.b.impl.closeHandler()
                    })
                },
                receive: function(handler) {
                    transports.a.impl.handler = handler
                },
                onclose: function(handler) {
                    transports.a.impl.closeHandler = handler
                }
            },
            b: {
                impl: {
                    handler: function() {},
                    closeHandler: function() {}
                },
                send: function(msg) {
                    process.nextTick(function() {
                        transports.a.impl.handler(msg)
                    })
                },
                close: function() {
                    process.nextTick(function() {
                        transports.b.impl.closeHandler()
                        transports.a.impl.closeHandler()
                    })
                },
                receive: function(handler) {
                    transports.b.impl.handler = handler
                },
                onclose: function(handler) {
                    transports.b.impl.closeHandler = handler
                }
            }
        }

        return transports
    }

    sockception.pair = function() {
        var pair = impl.transportPair()

        return {
            a: sockception.fromPrefixAndTransport("a", pair.a),
            b: sockception.fromPrefixAndTransport("b", pair.b)
        }
    }

    sockception.listen = function(opt) {
        if (!ws) {
            throw new Error("Websocket server not supported in this environment")
        }

        var wss = new ws.Server({port: opt.port})

        var sockHandler = function() {}

        wss.on("connection", function(websock) {
            var handler = function() {} // TODO: timeout queues?

            websock.on("message", function(msg) {
                handler(msg.toString())
            })

            sockHandler(sockception.fromPrefixAndTransport(
                "s",
                {
                    send: function(s) {
                        websock.send(s, function(error) {
                            if (error && opt.log && opt.log.error) {
                                opt.log.error("ws: " + error)
                            }
                        })
                    },
                    close: function() { websock.close() }, // TODO: test
                    receive: function(cb) {
                        websock.onmessage = function(msg) {
                            cb(msg.data.toString())
                        }
                    },
                    onclose: function(cb) { websock.onclose = cb } // TODO: test
                },
                opt.log))
        })

        return {
            receiveMany: function(handler) {
                sockHandler = handler
            },
            close: function() { wss.close() }
        }
    }

    impl.clientWebsocketTransport = (
        ws ?
        function(addr, log) {
            var sock = new ws(addr)

            return {
                send: function(msg) {
                    sock.send(msg, function(error) {
                        if (error) {
                            log.error("ws: " + error)
                        }
                    })
                },
                close: function() { sock.close() },
                receive: function(cb) { sock.onmessage = function(msg) {
                    cb(msg.data.toString())
                }},
                onclose: function(cb) { sock.onclose = cb }
            }
        } :
        function(addr) {
            var sock = new WebSocket(addr)

            return {
                send: function(msg) { sock.send(msg) },
                close: function() { sock.close() },
                receive: function(cb) { sock.onmessage = function(msg) { cb(msg.data.toString()) } },
                onclose: function(cb) { sock.onclose = cb }
            }
        }
    )

    sockception.connect = function(address, log) {
        return sockception.fromPrefixAndTransport("c", impl.clientWebsocketTransport(address, log), log)
    }

    sockception.util = require("./util")
})(
    typeof module === "undefined" ? {exports: {}} : module,
    typeof require === "undefined" ? function() {} : require
)
}).call(this,require('_process'))

},{"./util":"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/sockception/lib/util.js","_process":"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/browserify-middleware/node_modules/browserify/node_modules/process/browser.js","ws":"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/sockception/node_modules/ws/lib/browser.js"}],"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/sockception/lib/util.js":[function(require,module,exports){
"use strict";

;(function(module) {
    var util = module.exports
    var sc = (this.sockception === undefined ? {} : this.sockception)
    sc.util = util

    // DEPRECATED
    util.router = function() {
        var router = function(s) {
            var route = router.impl.transform(s.value)
            var handler = router.impl.routes[route] || router.impl.default
            handler(s)
        }

        router.impl = {
            transform: function(value) { return value },
            routes: {},
            default: function() {}
        }

        router.transform = function(transform) {
            router.impl.transform = transform
            return router
        }

        router.route = function(route, handler) {
            router.impl.routes[route] = handler
            return router
        }

        router.unroute = function(route) {
            delete router.impl.routes[route]
            return router
        }

        router.unrouteAll = function() {
            router.impl.routes = {}
            return router
        }

        router.default = function(handler) {
            router.impl.default = handler
            return router
        }

        return router
    }

    util.chain = function() {
        var chain = function(s) {
            chain.impl.handlers.forEach(function(handler) {
                handler(s)
            })
        }

        chain.impl = {
            handlers: []
        }

        chain.push = function(handler) {
            chain.impl.handlers.push(handler)
            return chain
        }

        chain.pop = function() {
            chain.impl.handlers.pop()
            return chain
        }

        chain.shift = function() {
            chain.impl.handlers.shift()
            return chain
        }

        chain.unshift = function(handler) {
            chain.impl.handlers.unshift(handler)
            return chain
        }

        chain.clear = function() {
            chain.impl.handlers.length = 0
            return chain
        }

        return chain
    }

    util.acker = function(s) { s.send("ack") }
    util.echo = function(s) { s.send(s.value) }

    // DEPRECATED
    util.once = function(f) {
        var called = false

        return function(s) {
            if (called) {
                return
            }

            called = true
            return f(s)
        }
    }
}).call(this, typeof module === "undefined" ? {exports: {}} : module)
},{}],"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/sockception/node_modules/ws/lib/browser.js":[function(require,module,exports){

/**
 * Module dependencies.
 */

var global = (function() { return this; })();

/**
 * WebSocket constructor.
 */

var WebSocket = global.WebSocket || global.MozWebSocket;

/**
 * Module exports.
 */

module.exports = WebSocket ? ws : null;

/**
 * WebSocket constructor.
 *
 * The third `opts` options object gets ignored in web browsers, since it's
 * non-standard, and throws a TypeError if passed to the constructor.
 * See: https://github.com/einaros/ws/issues/227
 *
 * @param {String} uri
 * @param {Array} protocols (optional)
 * @param {Object) opts (optional)
 * @api public
 */

function ws(uri, protocols, opts) {
  var instance;
  if (protocols) {
    instance = new WebSocket(uri, protocols);
  } else {
    instance = new WebSocket(uri);
  }
  return instance;
}

if (WebSocket) ws.prototype = WebSocket.prototype;

},{}],"/Users/andrew/Dropbox/dev/js/mouseMazer/src/createMazeDisplay.js":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
var createBlock = function createBlock(x, y, w, h, cssClass) {
    var el = document.createElement('div');

    el.style.position = 'absolute';

    el.style.left = x + 'px';
    el.style.top = y + 'px';
    el.style.width = w + 'px';
    el.style.height = h + 'px';

    el.setAttribute('class', cssClass);

    return el;
};

exports['default'] = function (mz) {
    var el = document.createElement('div');
    el.setAttribute('class', 'maze');

    var edgeUnits = 0.1;

    var mzDisplayWidthUnits = mz.size.cols + edgeUnits * (mz.size.cols + 1);
    var mzDisplayHeightUnits = mz.size.rows + edgeUnits * (mz.size.rows + 1);

    var unitSize = 0.9 * Math.min(window.innerWidth / mzDisplayWidthUnits, window.innerHeight / mzDisplayHeightUnits);

    var xStart = 0.5 * (window.innerWidth - unitSize * mzDisplayWidthUnits);
    var yStart = 0.5 * (window.innerHeight - unitSize * mzDisplayHeightUnits);

    // corners
    for (var i = 0; i <= mz.size.rows; ++i) {
        for (var j = 0; j <= mz.size.cols; ++j) {
            el.appendChild(createBlock(xStart + j * unitSize * (1 + edgeUnits), yStart + i * unitSize * (1 + edgeUnits), unitSize * edgeUnits, unitSize * edgeUnits, 'corner'));
        }
    }

    // horizontal edges
    for (var i = 0; i <= mz.size.rows; ++i) {
        for (var j = 0; j < mz.size.cols; ++j) {
            el.appendChild(createBlock(xStart + unitSize * (edgeUnits + j * (1 + edgeUnits)), yStart + unitSize * i * (1 + edgeUnits), unitSize * 1, unitSize * edgeUnits, 'wall' + (mz.edges.horizontal[i][j] ? '' : ' enabled')));
        }
    }

    // vertical edges
    for (var i = 0; i < mz.size.rows; ++i) {
        for (var j = 0; j <= mz.size.cols; ++j) {
            el.appendChild(createBlock(xStart + unitSize * j * (1 + edgeUnits), yStart + unitSize * (edgeUnits + i * (1 + edgeUnits)), unitSize * edgeUnits, unitSize * 1, 'wall' + (mz.edges.vertical[i][j] ? '' : ' enabled')));
        }
    }

    // cells
    for (var i = 0; i < mz.size.rows; ++i) {
        for (var j = 0; j < mz.size.cols; ++j) {
            el.appendChild(createBlock(xStart + unitSize * (edgeUnits + j * (1 + edgeUnits)), yStart + unitSize * (edgeUnits + i * (1 + edgeUnits)), unitSize * 1, unitSize * 1, 'cell'));
        }
    }

    return {
        element: el,
        getPos: function getPos(i, j) {
            return {
                x: xStart + unitSize * (edgeUnits + 0.5 + j * (1 + edgeUnits)),
                y: yStart + unitSize * (edgeUnits + 0.5 + i * (1 + edgeUnits)) };
        }
    };
};

module.exports = exports['default'];

},{}],"/Users/andrew/Dropbox/dev/js/mouseMazer/src/index.js":[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _maze = require('./maze');

var _maze2 = _interopRequireDefault(_maze);

var _createMazeDisplay = require('./createMazeDisplay');

var _createMazeDisplay2 = _interopRequireDefault(_createMazeDisplay);

var _mouse = require('./mouse');

var _mouse2 = _interopRequireDefault(_mouse);

var _sockception = require('sockception');

var _sockception2 = _interopRequireDefault(_sockception);

var startNewGame = function startNewGame(edges, pos, onUpdate) {
    // Clear current document
    while (document.body.firstChild) {
        document.body.removeChild(document.body.firstChild);
    }

    var mz = _maze2['default'].grid(edges);
    var mazeDisplay = (0, _createMazeDisplay2['default'])(mz);

    document.body.appendChild(mazeDisplay.element);

    var mouseCellPos = mazeDisplay.getPos(pos.row, pos.col);

    var cheeseCellPos = mazeDisplay.getPos(mz.size.rows - 1, mz.size.cols - 1);
    var cheeseElement = document.createElement('img');
    cheeseElement.src = 'assets/cheese.gif';
    cheeseElement.style.position = 'absolute';
    cheeseElement.style.left = cheeseCellPos.x - 16 + 'px';
    cheeseElement.style.top = cheeseCellPos.y - 16 + 'px';
    document.body.appendChild(cheeseElement);

    var mazeMouse = new _mouse2['default'](mouseCellPos.x, mouseCellPos.y);
    document.body.appendChild(mazeMouse.element);

    onUpdate(function (update) {
        var mouseCellPos = mazeDisplay.getPos(update.pos.row, update.pos.col);

        mazeMouse.move(mouseCellPos.x, mouseCellPos.y, 500).then(function () {
            console.log(update.stepCount + ' / ' + update.stepMax);
        });
    });
};

window.addEventListener('load', function () {
    var sock = _sockception2['default'].connect('ws://' + window.location.hostname + ':56657');

    sock.route('connected').receiveOne(function () {
        var updateHandler = function updateHandler() {};

        sock.route('getStarts').send().receiveMany(function (res) {
            startNewGame(res.value, { row: 0, col: 0 }, function (handler) {
                return updateHandler = handler;
            });
        });

        sock.route('getUpdates').send().receiveMany(function (res) {
            return updateHandler(res.value);
        });

        sock.route('getStops').receiveMany(function (res) {
            setTimeout(console.log(res.value), 500);
        });

        sock.route('getCurrent').send().receiveOne(function (res) {
            if (res.value === null) {
                sock.route('start').send();
            } else {
                startNewGame(res.value.edges, res.value.update.pos, function (handler) {
                    return updateHandler = handler;
                });
            }
        });
    });
});

},{"./createMazeDisplay":"/Users/andrew/Dropbox/dev/js/mouseMazer/src/createMazeDisplay.js","./maze":"/Users/andrew/Dropbox/dev/js/mouseMazer/src/maze.js","./mouse":"/Users/andrew/Dropbox/dev/js/mouseMazer/src/mouse.js","sockception":"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/sockception/lib/index.js"}],"/Users/andrew/Dropbox/dev/js/mouseMazer/src/maze.js":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
var shuffle = require('lodash/collection/shuffle');
var all = require('lodash/collection/all');

var maze = {};
exports['default'] = maze;

maze.checkEdgesAndGetSize = function (edges) {
    if (!Array.isArray(edges.horizontal)) {
        return null;
    }

    if (!Array.isArray(edges.vertical)) {
        return null;
    }

    var rows = edges.vertical.length;
    var cols = edges.horizontal[0].length;

    if (all(edges.vertical, function (row) {
        return Array.isArray(row) && row.length === cols + 1;
    }) && all(edges.horizontal, function (row) {
        return Array.isArray(row) && row.length === cols;
    }) && all([edges.vertical, edges.horizontal], function (e) {
        return all(e, function (row) {
            return all(row, function (edgeUnit) {
                return typeof edgeUnit === 'boolean';
            });
        });
    })) {
        return { rows: rows, cols: cols };
    }

    return null;
};

maze.grid = function (edges) {
    var api = {};

    api.size = maze.checkEdgesAndGetSize(edges);

    if (!api.size) {
        throw new Error('Invalid edges');
    }

    api.edges = edges;

    api.checkPos = function (_ref) {
        var row = _ref.row;
        var col = _ref.col;
        return 0 <= row && row < api.size.rows && 0 <= col && col < api.size.cols;
    };

    api.getCell = function (_ref2) {
        var row = _ref2.row;
        var col = _ref2.col;

        if (!api.checkPos({ row: row, col: col })) {
            throw new Error('Invalid pos');
        }

        var createEdge = function createEdge(pos) {
            if (!api.checkPos(pos)) {
                return null;
            }

            var matrix = pos.row !== row ? api.edges.horizontal : api.edges.vertical;

            var edgePos = {
                row: Math.max(row, pos.row),
                col: Math.max(col, pos.col)
            };

            return {
                getEnabled: function getEnabled() {
                    return matrix[edgePos.row][edgePos.col];
                },
                setEnabled: function setEnabled(val) {
                    matrix[edgePos.row][edgePos.col] = val;
                },
                get: function get() {
                    return api.getCell(pos);
                }
            };
        };

        return {
            id: row + ',' + col,
            data: { row: row, col: col },
            edges: {
                up: createEdge({ row: row - 1, col: col }),
                down: createEdge({ row: row + 1, col: col }),
                left: createEdge({ row: row, col: col - 1 }),
                right: createEdge({ row: row, col: col + 1 })
            }
        };
    };

    return api;
};

maze.shuffle = function (arr, rand) {
    for (var i = 0; i !== arr.length; ++i) {
        var j = i + Math.floor(rand() * (arr.length - i));
        var tmp = arr[i];
        arr[i] = arr[j];
        arr[j] = tmp;
    }
};

maze.depthFirstPrune = function (seedCell, rand) {
    var doStuff = arguments[2] === undefined ? function () {} : arguments[2];
    // TODO: rand unused
    var visitedCells = {};

    var visit = function visit(cell, enableEdgeToGetHere) {
        if (visitedCells[cell.id]) {
            return;
        }

        enableEdgeToGetHere();

        visitedCells[cell.id] = true;
        var edges = [];

        for (var direction in cell.edges) {
            var edge = cell.edges[direction];
            if (edge && !edge.getEnabled()) {
                edges.push(edge);
            }
        }

        shuffle(edges).forEach(function (edge) {
            visit(edge.get(), function () {
                return edge.setEnabled(true);
            });
        });
    };

    visit(seedCell, function () {});
};

var fill = function fill(len, val) {
    var arr = new Array(len);

    for (var i = 0; i !== len; ++i) {
        arr[i] = val();
    }

    return arr;
};

maze.generateBlank = function (_ref3) {
    var rows = _ref3.rows;
    var cols = _ref3.cols;

    return maze.grid({
        horizontal: fill(rows + 1, function () {
            return fill(cols, function () {
                return false;
            });
        }),
        vertical: fill(rows, function () {
            return fill(cols + 1, function () {
                return false;
            });
        })
    });
};

maze.generate = function (_ref4) {
    var rows = _ref4.rows;
    var cols = _ref4.cols;

    var result = maze.generateBlank({ rows: rows, cols: cols });
    maze.depthFirstPrune(result.getCell({ row: 0, col: 0 }), Math.random);
    return result;
};

maze.print = function (grid) {
    if (grid.size.rows === 0) {
        return;
    }

    var printHorizontalRow = function printHorizontalRow(row) {
        var str = '';
        row.forEach(function (x) {
            return str += '.' + (x ? ' ' : '_');
        });
        str += '.';
        console.log(str);
    };

    var printVerticalRow = function printVerticalRow(row) {
        var str = '';
        row.forEach(function (x) {
            return str += (x ? ' ' : '|') + ' ';
        });
        console.log(str);
    };

    printHorizontalRow(grid.edges.horizontal[0]);

    for (var i = 0; i !== grid.size.rows; ++i) {
        printVerticalRow(grid.edges.vertical[i]);
        printHorizontalRow(grid.edges.horizontal[i + 1]);
    }
};
module.exports = exports['default'];

},{"lodash/collection/all":"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/collection/all.js","lodash/collection/shuffle":"/Users/andrew/Dropbox/dev/js/mouseMazer/node_modules/lodash/collection/shuffle.js"}],"/Users/andrew/Dropbox/dev/js/mouseMazer/src/mouse.js":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

exports['default'] = function (x, y) {
    var self = this;

    self.x = x;
    self.y = y;

    self.element = document.createElement('div');
    self.element.setAttribute('class', 'mouse');
    self.element.style.position = 'relative';
    self.element.style.width = '48px';
    self.element.style.height = '48px';
    self.element.style.overflow = 'hidden';

    self.imgElement = document.createElement('img');
    self.imgElement.src = 'assets/mouse.png';
    self.imgElement.style.position = 'absolute';
    self.imgElement.style.left = '0px';
    self.imgElement.style.top = '0px';
    self.element.appendChild(self.imgElement);

    self.updatePosition = function () {
        self.element.style.left = self.x - 24 + 'px';
        self.element.style.top = self.y - 32 + 'px';
    };

    self.updatePosition();

    self.updateImageClip = function () {
        var left = 48 * self.clippingIndex;

        var top = ({
            'up': 48 * 3,
            'down': 48 * 0,
            'left': 48 * 1,
            'right': 48 * 2
        })[self.direction];

        self.imgElement.style.left = -left + 'px';
        self.imgElement.style.top = -top + 'px';
    };

    self.direction = 'down';
    self.clippingIndex = 0;

    self.clippingStep = function () {
        self.clippingIndex++;
        self.clippingIndex %= 4;
        self.updateImageClip();
    };

    self.clippingInterval = setInterval(self.clippingStep, 250);

    self.changeDirection = function (direction) {
        self.direction = direction;
        clearInterval(self.clippingInterval);
        self.updateImageClip();
        self.clippingInterval = setInterval(self.clippingStep, 250);
    };

    self.animationUpdate = function () {
        var dt = new Date() - self.animation.startTime;

        if (dt >= self.animation.duration) {
            self.x = self.animation.endX;
            self.y = self.animation.endY;
            self.updatePosition();
            self.animation.resolve();
            self.animation = null;
            return;
        }

        var p = dt / self.animation.duration;
        self.x = (1 - p) * self.animation.startX + p * self.animation.endX;
        self.y = (1 - p) * self.animation.startY + p * self.animation.endY;
        self.updatePosition();
        self.animation.requestId = window.requestAnimationFrame(self.animationUpdate);
    };

    self.animation = null;

    self.move = function (x, y, duration) {
        return new Promise(function (resolve) {
            var dx = x - self.x;
            var dy = y - self.y;

            if (Math.abs(dx) > Math.abs(dy)) {
                self.changeDirection(dx > 0 ? 'right' : 'left');
            } else {
                self.changeDirection(dy > 0 ? 'down' : 'up');
            }

            if (self.animation) {
                window.cancelAnimationFrame(self.animation.requestId);
                self.animation.resolve();
            }

            self.animation = {
                startTime: new Date(),
                duration: duration,
                startX: self.x,
                startY: self.y,
                endX: x,
                endY: y,
                requestId: window.requestAnimationFrame(self.animationUpdate),
                resolve: resolve
            };
        });
    };
};

module.exports = exports['default'];

},{}]},{},["/Users/andrew/Dropbox/dev/js/mouseMazer/src/index.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5LW1pZGRsZXdhcmUvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5LW1pZGRsZXdhcmUvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvYXJyYXkvbGFzdC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvY29sbGVjdGlvbi9hbGwuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2NvbGxlY3Rpb24vZXZlcnkuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2NvbGxlY3Rpb24vc2h1ZmZsZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvaW50ZXJuYWwvYXJyYXlFdmVyeS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvaW50ZXJuYWwvYmFzZUNhbGxiYWNrLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9pbnRlcm5hbC9iYXNlRWFjaC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvaW50ZXJuYWwvYmFzZUV2ZXJ5LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9pbnRlcm5hbC9iYXNlRm9yLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9pbnRlcm5hbC9iYXNlRm9yT3duLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9pbnRlcm5hbC9iYXNlR2V0LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9pbnRlcm5hbC9iYXNlSXNFcXVhbC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvaW50ZXJuYWwvYmFzZUlzRXF1YWxEZWVwLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9pbnRlcm5hbC9iYXNlSXNNYXRjaC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvaW50ZXJuYWwvYmFzZU1hdGNoZXMuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2ludGVybmFsL2Jhc2VNYXRjaGVzUHJvcGVydHkuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2ludGVybmFsL2Jhc2VQcm9wZXJ0eS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvaW50ZXJuYWwvYmFzZVByb3BlcnR5RGVlcC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvaW50ZXJuYWwvYmFzZVJhbmRvbS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvaW50ZXJuYWwvYmFzZVNsaWNlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9pbnRlcm5hbC9iYXNlVG9TdHJpbmcuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2ludGVybmFsL2Jhc2VWYWx1ZXMuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2ludGVybmFsL2JpbmRDYWxsYmFjay5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvaW50ZXJuYWwvY3JlYXRlQmFzZUVhY2guanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2ludGVybmFsL2NyZWF0ZUJhc2VGb3IuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2ludGVybmFsL2VxdWFsQXJyYXlzLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9pbnRlcm5hbC9lcXVhbEJ5VGFnLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9pbnRlcm5hbC9lcXVhbE9iamVjdHMuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2ludGVybmFsL2dldExlbmd0aC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvaW50ZXJuYWwvaXNBcnJheUxpa2UuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2ludGVybmFsL2lzSW5kZXguanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2ludGVybmFsL2lzSXRlcmF0ZWVDYWxsLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9pbnRlcm5hbC9pc0tleS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvaW50ZXJuYWwvaXNMZW5ndGguanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2ludGVybmFsL2lzT2JqZWN0TGlrZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvaW50ZXJuYWwvaXNTdHJpY3RDb21wYXJhYmxlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9pbnRlcm5hbC9zaGltS2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvaW50ZXJuYWwvdG9JdGVyYWJsZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvaW50ZXJuYWwvdG9PYmplY3QuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2ludGVybmFsL3RvUGF0aC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvbGFuZy9pc0FyZ3VtZW50cy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvbGFuZy9pc0FycmF5LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9sYW5nL2lzTmF0aXZlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9sYW5nL2lzT2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9sYW5nL2lzVHlwZWRBcnJheS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvb2JqZWN0L2tleXMuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL29iamVjdC9rZXlzSW4uanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL29iamVjdC92YWx1ZXMuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL3N0cmluZy9lc2NhcGVSZWdFeHAuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL3N1cHBvcnQuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL3V0aWxpdHkvY29uc3RhbnQuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL3V0aWxpdHkvaWRlbnRpdHkuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL3V0aWxpdHkvcHJvcGVydHkuanMiLCJub2RlX21vZHVsZXMvc29ja2NlcHRpb24vbGliL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3NvY2tjZXB0aW9uL2xpYi91dGlsLmpzIiwibm9kZV9tb2R1bGVzL3NvY2tjZXB0aW9uL25vZGVfbW9kdWxlcy93cy9saWIvYnJvd3Nlci5qcyIsIi9Vc2Vycy9hbmRyZXcvRHJvcGJveC9kZXYvanMvbW91c2VNYXplci9zcmMvY3JlYXRlTWF6ZURpc3BsYXkuanMiLCIvVXNlcnMvYW5kcmV3L0Ryb3Bib3gvZGV2L2pzL21vdXNlTWF6ZXIvc3JjL2luZGV4LmpzIiwiL1VzZXJzL2FuZHJldy9Ecm9wYm94L2Rldi9qcy9tb3VzZU1hemVyL3NyYy9tYXplLmpzIiwiL1VzZXJzL2FuZHJldy9Ecm9wYm94L2Rldi9qcy9tb3VzZU1hemVyL3NyYy9tb3VzZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3REQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUM3RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUM1VUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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UyxFQUFFLElBQUksSUFBSSxFQUFFO0FBQ3JCLHdCQUFRLEVBQVIsUUFBUTtBQUNSLHNCQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDZCxzQkFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ2Qsb0JBQUksRUFBRSxDQUFDO0FBQ1Asb0JBQUksRUFBRSxDQUFDO0FBQ1AseUJBQVMsRUFBRSxNQUFNLENBQUMscUJBQXFCLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQztBQUM3RCx1QkFBTyxFQUFQLE9BQU87YUFDVixDQUFBO1NBQ0osQ0FBQyxDQUFBO0tBQ0wsQ0FBQTtDQUNKIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxuXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xuXG5mdW5jdGlvbiBkcmFpblF1ZXVlKCkge1xuICAgIGlmIChkcmFpbmluZykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGRyYWluaW5nID0gdHJ1ZTtcbiAgICB2YXIgY3VycmVudFF1ZXVlO1xuICAgIHZhciBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgd2hpbGUobGVuKSB7XG4gICAgICAgIGN1cnJlbnRRdWV1ZSA9IHF1ZXVlO1xuICAgICAgICBxdWV1ZSA9IFtdO1xuICAgICAgICB2YXIgaSA9IC0xO1xuICAgICAgICB3aGlsZSAoKytpIDwgbGVuKSB7XG4gICAgICAgICAgICBjdXJyZW50UXVldWVbaV0oKTtcbiAgICAgICAgfVxuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGRyYWluaW5nID0gZmFsc2U7XG59XG5wcm9jZXNzLm5leHRUaWNrID0gZnVuY3Rpb24gKGZ1bikge1xuICAgIHF1ZXVlLnB1c2goZnVuKTtcbiAgICBpZiAoIWRyYWluaW5nKSB7XG4gICAgICAgIHNldFRpbWVvdXQoZHJhaW5RdWV1ZSwgMCk7XG4gICAgfVxufTtcblxucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5wcm9jZXNzLnZlcnNpb24gPSAnJzsgLy8gZW1wdHkgc3RyaW5nIHRvIGF2b2lkIHJlZ2V4cCBpc3N1ZXNcbnByb2Nlc3MudmVyc2lvbnMgPSB7fTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbi8vIFRPRE8oc2h0eWxtYW4pXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbnByb2Nlc3MudW1hc2sgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH07XG4iLCIvKipcbiAqIEdldHMgdGhlIGxhc3QgZWxlbWVudCBvZiBgYXJyYXlgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgQXJyYXlcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBsYXN0IGVsZW1lbnQgb2YgYGFycmF5YC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5sYXN0KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiAzXG4gKi9cbmZ1bmN0aW9uIGxhc3QoYXJyYXkpIHtcbiAgdmFyIGxlbmd0aCA9IGFycmF5ID8gYXJyYXkubGVuZ3RoIDogMDtcbiAgcmV0dXJuIGxlbmd0aCA/IGFycmF5W2xlbmd0aCAtIDFdIDogdW5kZWZpbmVkO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGxhc3Q7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vZXZlcnknKTtcbiIsInZhciBhcnJheUV2ZXJ5ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWwvYXJyYXlFdmVyeScpLFxuICAgIGJhc2VDYWxsYmFjayA9IHJlcXVpcmUoJy4uL2ludGVybmFsL2Jhc2VDYWxsYmFjaycpLFxuICAgIGJhc2VFdmVyeSA9IHJlcXVpcmUoJy4uL2ludGVybmFsL2Jhc2VFdmVyeScpLFxuICAgIGlzQXJyYXkgPSByZXF1aXJlKCcuLi9sYW5nL2lzQXJyYXknKSxcbiAgICBpc0l0ZXJhdGVlQ2FsbCA9IHJlcXVpcmUoJy4uL2ludGVybmFsL2lzSXRlcmF0ZWVDYWxsJyk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGBwcmVkaWNhdGVgIHJldHVybnMgdHJ1dGh5IGZvciAqKmFsbCoqIGVsZW1lbnRzIG9mIGBjb2xsZWN0aW9uYC5cbiAqIFRoZSBwcmVkaWNhdGUgaXMgYm91bmQgdG8gYHRoaXNBcmdgIGFuZCBpbnZva2VkIHdpdGggdGhyZWUgYXJndW1lbnRzOlxuICogKHZhbHVlLCBpbmRleHxrZXksIGNvbGxlY3Rpb24pLlxuICpcbiAqIElmIGEgcHJvcGVydHkgbmFtZSBpcyBwcm92aWRlZCBmb3IgYHByZWRpY2F0ZWAgdGhlIGNyZWF0ZWQgYF8ucHJvcGVydHlgXG4gKiBzdHlsZSBjYWxsYmFjayByZXR1cm5zIHRoZSBwcm9wZXJ0eSB2YWx1ZSBvZiB0aGUgZ2l2ZW4gZWxlbWVudC5cbiAqXG4gKiBJZiBhIHZhbHVlIGlzIGFsc28gcHJvdmlkZWQgZm9yIGB0aGlzQXJnYCB0aGUgY3JlYXRlZCBgXy5tYXRjaGVzUHJvcGVydHlgXG4gKiBzdHlsZSBjYWxsYmFjayByZXR1cm5zIGB0cnVlYCBmb3IgZWxlbWVudHMgdGhhdCBoYXZlIGEgbWF0Y2hpbmcgcHJvcGVydHlcbiAqIHZhbHVlLCBlbHNlIGBmYWxzZWAuXG4gKlxuICogSWYgYW4gb2JqZWN0IGlzIHByb3ZpZGVkIGZvciBgcHJlZGljYXRlYCB0aGUgY3JlYXRlZCBgXy5tYXRjaGVzYCBzdHlsZVxuICogY2FsbGJhY2sgcmV0dXJucyBgdHJ1ZWAgZm9yIGVsZW1lbnRzIHRoYXQgaGF2ZSB0aGUgcHJvcGVydGllcyBvZiB0aGUgZ2l2ZW5cbiAqIG9iamVjdCwgZWxzZSBgZmFsc2VgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAYWxpYXMgYWxsXG4gKiBAY2F0ZWdvcnkgQ29sbGVjdGlvblxuICogQHBhcmFtIHtBcnJheXxPYmplY3R8c3RyaW5nfSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb258T2JqZWN0fHN0cmluZ30gW3ByZWRpY2F0ZT1fLmlkZW50aXR5XSBUaGUgZnVuY3Rpb24gaW52b2tlZFxuICogIHBlciBpdGVyYXRpb24uXG4gKiBAcGFyYW0geyp9IFt0aGlzQXJnXSBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYHByZWRpY2F0ZWAuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYWxsIGVsZW1lbnRzIHBhc3MgdGhlIHByZWRpY2F0ZSBjaGVjayxcbiAqICBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uZXZlcnkoW3RydWUsIDEsIG51bGwsICd5ZXMnXSwgQm9vbGVhbik7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIHZhciB1c2VycyA9IFtcbiAqICAgeyAndXNlcic6ICdiYXJuZXknLCAnYWN0aXZlJzogZmFsc2UgfSxcbiAqICAgeyAndXNlcic6ICdmcmVkJywgICAnYWN0aXZlJzogZmFsc2UgfVxuICogXTtcbiAqXG4gKiAvLyB1c2luZyB0aGUgYF8ubWF0Y2hlc2AgY2FsbGJhY2sgc2hvcnRoYW5kXG4gKiBfLmV2ZXJ5KHVzZXJzLCB7ICd1c2VyJzogJ2Jhcm5leScsICdhY3RpdmUnOiBmYWxzZSB9KTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogLy8gdXNpbmcgdGhlIGBfLm1hdGNoZXNQcm9wZXJ0eWAgY2FsbGJhY2sgc2hvcnRoYW5kXG4gKiBfLmV2ZXJ5KHVzZXJzLCAnYWN0aXZlJywgZmFsc2UpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIC8vIHVzaW5nIHRoZSBgXy5wcm9wZXJ0eWAgY2FsbGJhY2sgc2hvcnRoYW5kXG4gKiBfLmV2ZXJ5KHVzZXJzLCAnYWN0aXZlJyk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBldmVyeShjb2xsZWN0aW9uLCBwcmVkaWNhdGUsIHRoaXNBcmcpIHtcbiAgdmFyIGZ1bmMgPSBpc0FycmF5KGNvbGxlY3Rpb24pID8gYXJyYXlFdmVyeSA6IGJhc2VFdmVyeTtcbiAgaWYgKHRoaXNBcmcgJiYgaXNJdGVyYXRlZUNhbGwoY29sbGVjdGlvbiwgcHJlZGljYXRlLCB0aGlzQXJnKSkge1xuICAgIHByZWRpY2F0ZSA9IG51bGw7XG4gIH1cbiAgaWYgKHR5cGVvZiBwcmVkaWNhdGUgIT0gJ2Z1bmN0aW9uJyB8fCB0aGlzQXJnICE9PSB1bmRlZmluZWQpIHtcbiAgICBwcmVkaWNhdGUgPSBiYXNlQ2FsbGJhY2socHJlZGljYXRlLCB0aGlzQXJnLCAzKTtcbiAgfVxuICByZXR1cm4gZnVuYyhjb2xsZWN0aW9uLCBwcmVkaWNhdGUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGV2ZXJ5O1xuIiwidmFyIGJhc2VSYW5kb20gPSByZXF1aXJlKCcuLi9pbnRlcm5hbC9iYXNlUmFuZG9tJyksXG4gICAgdG9JdGVyYWJsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFsL3RvSXRlcmFibGUnKTtcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGFycmF5IG9mIHNodWZmbGVkIHZhbHVlcywgdXNpbmcgYSB2ZXJzaW9uIG9mIHRoZVxuICogW0Zpc2hlci1ZYXRlcyBzaHVmZmxlXShodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9GaXNoZXItWWF0ZXNfc2h1ZmZsZSkuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBDb2xsZWN0aW9uXG4gKiBAcGFyYW0ge0FycmF5fE9iamVjdHxzdHJpbmd9IGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gc2h1ZmZsZS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgbmV3IHNodWZmbGVkIGFycmF5LlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLnNodWZmbGUoWzEsIDIsIDMsIDRdKTtcbiAqIC8vID0+IFs0LCAxLCAzLCAyXVxuICovXG5mdW5jdGlvbiBzaHVmZmxlKGNvbGxlY3Rpb24pIHtcbiAgY29sbGVjdGlvbiA9IHRvSXRlcmFibGUoY29sbGVjdGlvbik7XG5cbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBjb2xsZWN0aW9uLmxlbmd0aCxcbiAgICAgIHJlc3VsdCA9IEFycmF5KGxlbmd0aCk7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIgcmFuZCA9IGJhc2VSYW5kb20oMCwgaW5kZXgpO1xuICAgIGlmIChpbmRleCAhPSByYW5kKSB7XG4gICAgICByZXN1bHRbaW5kZXhdID0gcmVzdWx0W3JhbmRdO1xuICAgIH1cbiAgICByZXN1bHRbcmFuZF0gPSBjb2xsZWN0aW9uW2luZGV4XTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNodWZmbGU7XG4iLCIvKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgXy5ldmVyeWAgZm9yIGFycmF5cyB3aXRob3V0IHN1cHBvcnQgZm9yIGNhbGxiYWNrXG4gKiBzaG9ydGhhbmRzIGFuZCBgdGhpc2AgYmluZGluZy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHByZWRpY2F0ZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGFsbCBlbGVtZW50cyBwYXNzIHRoZSBwcmVkaWNhdGUgY2hlY2ssXG4gKiAgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBhcnJheUV2ZXJ5KGFycmF5LCBwcmVkaWNhdGUpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBhcnJheS5sZW5ndGg7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICBpZiAoIXByZWRpY2F0ZShhcnJheVtpbmRleF0sIGluZGV4LCBhcnJheSkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXJyYXlFdmVyeTtcbiIsInZhciBiYXNlTWF0Y2hlcyA9IHJlcXVpcmUoJy4vYmFzZU1hdGNoZXMnKSxcbiAgICBiYXNlTWF0Y2hlc1Byb3BlcnR5ID0gcmVxdWlyZSgnLi9iYXNlTWF0Y2hlc1Byb3BlcnR5JyksXG4gICAgYmluZENhbGxiYWNrID0gcmVxdWlyZSgnLi9iaW5kQ2FsbGJhY2snKSxcbiAgICBpZGVudGl0eSA9IHJlcXVpcmUoJy4uL3V0aWxpdHkvaWRlbnRpdHknKSxcbiAgICBwcm9wZXJ0eSA9IHJlcXVpcmUoJy4uL3V0aWxpdHkvcHJvcGVydHknKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5jYWxsYmFja2Agd2hpY2ggc3VwcG9ydHMgc3BlY2lmeWluZyB0aGVcbiAqIG51bWJlciBvZiBhcmd1bWVudHMgdG8gcHJvdmlkZSB0byBgZnVuY2AuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gW2Z1bmM9Xy5pZGVudGl0eV0gVGhlIHZhbHVlIHRvIGNvbnZlcnQgdG8gYSBjYWxsYmFjay5cbiAqIEBwYXJhbSB7Kn0gW3RoaXNBcmddIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgZnVuY2AuXG4gKiBAcGFyYW0ge251bWJlcn0gW2FyZ0NvdW50XSBUaGUgbnVtYmVyIG9mIGFyZ3VtZW50cyB0byBwcm92aWRlIHRvIGBmdW5jYC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgY2FsbGJhY2suXG4gKi9cbmZ1bmN0aW9uIGJhc2VDYWxsYmFjayhmdW5jLCB0aGlzQXJnLCBhcmdDb3VudCkge1xuICB2YXIgdHlwZSA9IHR5cGVvZiBmdW5jO1xuICBpZiAodHlwZSA9PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIHRoaXNBcmcgPT09IHVuZGVmaW5lZFxuICAgICAgPyBmdW5jXG4gICAgICA6IGJpbmRDYWxsYmFjayhmdW5jLCB0aGlzQXJnLCBhcmdDb3VudCk7XG4gIH1cbiAgaWYgKGZ1bmMgPT0gbnVsbCkge1xuICAgIHJldHVybiBpZGVudGl0eTtcbiAgfVxuICBpZiAodHlwZSA9PSAnb2JqZWN0Jykge1xuICAgIHJldHVybiBiYXNlTWF0Y2hlcyhmdW5jKTtcbiAgfVxuICByZXR1cm4gdGhpc0FyZyA9PT0gdW5kZWZpbmVkXG4gICAgPyBwcm9wZXJ0eShmdW5jKVxuICAgIDogYmFzZU1hdGNoZXNQcm9wZXJ0eShmdW5jLCB0aGlzQXJnKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlQ2FsbGJhY2s7XG4iLCJ2YXIgYmFzZUZvck93biA9IHJlcXVpcmUoJy4vYmFzZUZvck93bicpLFxuICAgIGNyZWF0ZUJhc2VFYWNoID0gcmVxdWlyZSgnLi9jcmVhdGVCYXNlRWFjaCcpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmZvckVhY2hgIHdpdGhvdXQgc3VwcG9ydCBmb3IgY2FsbGJhY2tcbiAqIHNob3J0aGFuZHMgYW5kIGB0aGlzYCBiaW5kaW5nLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fE9iamVjdHxzdHJpbmd9IGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gaXRlcmF0ZWUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEByZXR1cm5zIHtBcnJheXxPYmplY3R8c3RyaW5nfSBSZXR1cm5zIGBjb2xsZWN0aW9uYC5cbiAqL1xudmFyIGJhc2VFYWNoID0gY3JlYXRlQmFzZUVhY2goYmFzZUZvck93bik7XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUVhY2g7XG4iLCJ2YXIgYmFzZUVhY2ggPSByZXF1aXJlKCcuL2Jhc2VFYWNoJyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uZXZlcnlgIHdpdGhvdXQgc3VwcG9ydCBmb3IgY2FsbGJhY2tcbiAqIHNob3J0aGFuZHMgYW5kIGB0aGlzYCBiaW5kaW5nLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fE9iamVjdHxzdHJpbmd9IGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gcHJlZGljYXRlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYWxsIGVsZW1lbnRzIHBhc3MgdGhlIHByZWRpY2F0ZSBjaGVjayxcbiAqICBlbHNlIGBmYWxzZWBcbiAqL1xuZnVuY3Rpb24gYmFzZUV2ZXJ5KGNvbGxlY3Rpb24sIHByZWRpY2F0ZSkge1xuICB2YXIgcmVzdWx0ID0gdHJ1ZTtcbiAgYmFzZUVhY2goY29sbGVjdGlvbiwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBjb2xsZWN0aW9uKSB7XG4gICAgcmVzdWx0ID0gISFwcmVkaWNhdGUodmFsdWUsIGluZGV4LCBjb2xsZWN0aW9uKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9KTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlRXZlcnk7XG4iLCJ2YXIgY3JlYXRlQmFzZUZvciA9IHJlcXVpcmUoJy4vY3JlYXRlQmFzZUZvcicpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBiYXNlRm9ySW5gIGFuZCBgYmFzZUZvck93bmAgd2hpY2ggaXRlcmF0ZXNcbiAqIG92ZXIgYG9iamVjdGAgcHJvcGVydGllcyByZXR1cm5lZCBieSBga2V5c0Z1bmNgIGludm9raW5nIGBpdGVyYXRlZWAgZm9yXG4gKiBlYWNoIHByb3BlcnR5LiBJdGVyYXRlZSBmdW5jdGlvbnMgbWF5IGV4aXQgaXRlcmF0aW9uIGVhcmx5IGJ5IGV4cGxpY2l0bHlcbiAqIHJldHVybmluZyBgZmFsc2VgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gaXRlcmF0ZWUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGtleXNGdW5jIFRoZSBmdW5jdGlvbiB0byBnZXQgdGhlIGtleXMgb2YgYG9iamVjdGAuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGBvYmplY3RgLlxuICovXG52YXIgYmFzZUZvciA9IGNyZWF0ZUJhc2VGb3IoKTtcblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlRm9yO1xuIiwidmFyIGJhc2VGb3IgPSByZXF1aXJlKCcuL2Jhc2VGb3InKSxcbiAgICBrZXlzID0gcmVxdWlyZSgnLi4vb2JqZWN0L2tleXMnKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5mb3JPd25gIHdpdGhvdXQgc3VwcG9ydCBmb3IgY2FsbGJhY2tcbiAqIHNob3J0aGFuZHMgYW5kIGB0aGlzYCBiaW5kaW5nLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gaXRlcmF0ZWUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VGb3JPd24ob2JqZWN0LCBpdGVyYXRlZSkge1xuICByZXR1cm4gYmFzZUZvcihvYmplY3QsIGl0ZXJhdGVlLCBrZXlzKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlRm9yT3duO1xuIiwidmFyIHRvT2JqZWN0ID0gcmVxdWlyZSgnLi90b09iamVjdCcpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBnZXRgIHdpdGhvdXQgc3VwcG9ydCBmb3Igc3RyaW5nIHBhdGhzXG4gKiBhbmQgZGVmYXVsdCB2YWx1ZXMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7QXJyYXl9IHBhdGggVGhlIHBhdGggb2YgdGhlIHByb3BlcnR5IHRvIGdldC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBbcGF0aEtleV0gVGhlIGtleSByZXByZXNlbnRhdGlvbiBvZiBwYXRoLlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIHJlc29sdmVkIHZhbHVlLlxuICovXG5mdW5jdGlvbiBiYXNlR2V0KG9iamVjdCwgcGF0aCwgcGF0aEtleSkge1xuICBpZiAob2JqZWN0ID09IG51bGwpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKHBhdGhLZXkgIT09IHVuZGVmaW5lZCAmJiBwYXRoS2V5IGluIHRvT2JqZWN0KG9iamVjdCkpIHtcbiAgICBwYXRoID0gW3BhdGhLZXldO1xuICB9XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gcGF0aC5sZW5ndGg7XG5cbiAgd2hpbGUgKG9iamVjdCAhPSBudWxsICYmICsraW5kZXggPCBsZW5ndGgpIHtcbiAgICBvYmplY3QgPSBvYmplY3RbcGF0aFtpbmRleF1dO1xuICB9XG4gIHJldHVybiAoaW5kZXggJiYgaW5kZXggPT0gbGVuZ3RoKSA/IG9iamVjdCA6IHVuZGVmaW5lZDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlR2V0O1xuIiwidmFyIGJhc2VJc0VxdWFsRGVlcCA9IHJlcXVpcmUoJy4vYmFzZUlzRXF1YWxEZWVwJyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaXNFcXVhbGAgd2l0aG91dCBzdXBwb3J0IGZvciBgdGhpc2AgYmluZGluZ1xuICogYGN1c3RvbWl6ZXJgIGZ1bmN0aW9ucy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7Kn0gb3RoZXIgVGhlIG90aGVyIHZhbHVlIHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY3VzdG9taXplcl0gVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBjb21wYXJpbmcgdmFsdWVzLlxuICogQHBhcmFtIHtib29sZWFufSBbaXNMb29zZV0gU3BlY2lmeSBwZXJmb3JtaW5nIHBhcnRpYWwgY29tcGFyaXNvbnMuXG4gKiBAcGFyYW0ge0FycmF5fSBbc3RhY2tBXSBUcmFja3MgdHJhdmVyc2VkIGB2YWx1ZWAgb2JqZWN0cy5cbiAqIEBwYXJhbSB7QXJyYXl9IFtzdGFja0JdIFRyYWNrcyB0cmF2ZXJzZWQgYG90aGVyYCBvYmplY3RzLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSB2YWx1ZXMgYXJlIGVxdWl2YWxlbnQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUlzRXF1YWwodmFsdWUsIG90aGVyLCBjdXN0b21pemVyLCBpc0xvb3NlLCBzdGFja0EsIHN0YWNrQikge1xuICAvLyBFeGl0IGVhcmx5IGZvciBpZGVudGljYWwgdmFsdWVzLlxuICBpZiAodmFsdWUgPT09IG90aGVyKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgdmFyIHZhbFR5cGUgPSB0eXBlb2YgdmFsdWUsXG4gICAgICBvdGhUeXBlID0gdHlwZW9mIG90aGVyO1xuXG4gIC8vIEV4aXQgZWFybHkgZm9yIHVubGlrZSBwcmltaXRpdmUgdmFsdWVzLlxuICBpZiAoKHZhbFR5cGUgIT0gJ2Z1bmN0aW9uJyAmJiB2YWxUeXBlICE9ICdvYmplY3QnICYmIG90aFR5cGUgIT0gJ2Z1bmN0aW9uJyAmJiBvdGhUeXBlICE9ICdvYmplY3QnKSB8fFxuICAgICAgdmFsdWUgPT0gbnVsbCB8fCBvdGhlciA9PSBudWxsKSB7XG4gICAgLy8gUmV0dXJuIGBmYWxzZWAgdW5sZXNzIGJvdGggdmFsdWVzIGFyZSBgTmFOYC5cbiAgICByZXR1cm4gdmFsdWUgIT09IHZhbHVlICYmIG90aGVyICE9PSBvdGhlcjtcbiAgfVxuICByZXR1cm4gYmFzZUlzRXF1YWxEZWVwKHZhbHVlLCBvdGhlciwgYmFzZUlzRXF1YWwsIGN1c3RvbWl6ZXIsIGlzTG9vc2UsIHN0YWNrQSwgc3RhY2tCKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlSXNFcXVhbDtcbiIsInZhciBlcXVhbEFycmF5cyA9IHJlcXVpcmUoJy4vZXF1YWxBcnJheXMnKSxcbiAgICBlcXVhbEJ5VGFnID0gcmVxdWlyZSgnLi9lcXVhbEJ5VGFnJyksXG4gICAgZXF1YWxPYmplY3RzID0gcmVxdWlyZSgnLi9lcXVhbE9iamVjdHMnKSxcbiAgICBpc0FycmF5ID0gcmVxdWlyZSgnLi4vbGFuZy9pc0FycmF5JyksXG4gICAgaXNUeXBlZEFycmF5ID0gcmVxdWlyZSgnLi4vbGFuZy9pc1R5cGVkQXJyYXknKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIGFyZ3NUYWcgPSAnW29iamVjdCBBcmd1bWVudHNdJyxcbiAgICBhcnJheVRhZyA9ICdbb2JqZWN0IEFycmF5XScsXG4gICAgb2JqZWN0VGFnID0gJ1tvYmplY3QgT2JqZWN0XSc7XG5cbi8qKiBVc2VkIGZvciBuYXRpdmUgbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIFVzZWQgdG8gcmVzb2x2ZSB0aGUgW2B0b1N0cmluZ1RhZ2BdKGh0dHBzOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sI3NlYy1vYmplY3QucHJvdG90eXBlLnRvc3RyaW5nKVxuICogb2YgdmFsdWVzLlxuICovXG52YXIgb2JqVG9TdHJpbmcgPSBvYmplY3RQcm90by50b1N0cmluZztcblxuLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYGJhc2VJc0VxdWFsYCBmb3IgYXJyYXlzIGFuZCBvYmplY3RzIHdoaWNoIHBlcmZvcm1zXG4gKiBkZWVwIGNvbXBhcmlzb25zIGFuZCB0cmFja3MgdHJhdmVyc2VkIG9iamVjdHMgZW5hYmxpbmcgb2JqZWN0cyB3aXRoIGNpcmN1bGFyXG4gKiByZWZlcmVuY2VzIHRvIGJlIGNvbXBhcmVkLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBvdGhlciBUaGUgb3RoZXIgb2JqZWN0IHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBlcXVhbEZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGRldGVybWluZSBlcXVpdmFsZW50cyBvZiB2YWx1ZXMuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY3VzdG9taXplcl0gVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBjb21wYXJpbmcgb2JqZWN0cy5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2lzTG9vc2VdIFNwZWNpZnkgcGVyZm9ybWluZyBwYXJ0aWFsIGNvbXBhcmlzb25zLlxuICogQHBhcmFtIHtBcnJheX0gW3N0YWNrQT1bXV0gVHJhY2tzIHRyYXZlcnNlZCBgdmFsdWVgIG9iamVjdHMuXG4gKiBAcGFyYW0ge0FycmF5fSBbc3RhY2tCPVtdXSBUcmFja3MgdHJhdmVyc2VkIGBvdGhlcmAgb2JqZWN0cy5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgb2JqZWN0cyBhcmUgZXF1aXZhbGVudCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBiYXNlSXNFcXVhbERlZXAob2JqZWN0LCBvdGhlciwgZXF1YWxGdW5jLCBjdXN0b21pemVyLCBpc0xvb3NlLCBzdGFja0EsIHN0YWNrQikge1xuICB2YXIgb2JqSXNBcnIgPSBpc0FycmF5KG9iamVjdCksXG4gICAgICBvdGhJc0FyciA9IGlzQXJyYXkob3RoZXIpLFxuICAgICAgb2JqVGFnID0gYXJyYXlUYWcsXG4gICAgICBvdGhUYWcgPSBhcnJheVRhZztcblxuICBpZiAoIW9iaklzQXJyKSB7XG4gICAgb2JqVGFnID0gb2JqVG9TdHJpbmcuY2FsbChvYmplY3QpO1xuICAgIGlmIChvYmpUYWcgPT0gYXJnc1RhZykge1xuICAgICAgb2JqVGFnID0gb2JqZWN0VGFnO1xuICAgIH0gZWxzZSBpZiAob2JqVGFnICE9IG9iamVjdFRhZykge1xuICAgICAgb2JqSXNBcnIgPSBpc1R5cGVkQXJyYXkob2JqZWN0KTtcbiAgICB9XG4gIH1cbiAgaWYgKCFvdGhJc0Fycikge1xuICAgIG90aFRhZyA9IG9ialRvU3RyaW5nLmNhbGwob3RoZXIpO1xuICAgIGlmIChvdGhUYWcgPT0gYXJnc1RhZykge1xuICAgICAgb3RoVGFnID0gb2JqZWN0VGFnO1xuICAgIH0gZWxzZSBpZiAob3RoVGFnICE9IG9iamVjdFRhZykge1xuICAgICAgb3RoSXNBcnIgPSBpc1R5cGVkQXJyYXkob3RoZXIpO1xuICAgIH1cbiAgfVxuICB2YXIgb2JqSXNPYmogPSBvYmpUYWcgPT0gb2JqZWN0VGFnLFxuICAgICAgb3RoSXNPYmogPSBvdGhUYWcgPT0gb2JqZWN0VGFnLFxuICAgICAgaXNTYW1lVGFnID0gb2JqVGFnID09IG90aFRhZztcblxuICBpZiAoaXNTYW1lVGFnICYmICEob2JqSXNBcnIgfHwgb2JqSXNPYmopKSB7XG4gICAgcmV0dXJuIGVxdWFsQnlUYWcob2JqZWN0LCBvdGhlciwgb2JqVGFnKTtcbiAgfVxuICBpZiAoIWlzTG9vc2UpIHtcbiAgICB2YXIgdmFsV3JhcHBlZCA9IG9iaklzT2JqICYmIGhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCAnX193cmFwcGVkX18nKSxcbiAgICAgICAgb3RoV3JhcHBlZCA9IG90aElzT2JqICYmIGhhc093blByb3BlcnR5LmNhbGwob3RoZXIsICdfX3dyYXBwZWRfXycpO1xuXG4gICAgaWYgKHZhbFdyYXBwZWQgfHwgb3RoV3JhcHBlZCkge1xuICAgICAgcmV0dXJuIGVxdWFsRnVuYyh2YWxXcmFwcGVkID8gb2JqZWN0LnZhbHVlKCkgOiBvYmplY3QsIG90aFdyYXBwZWQgPyBvdGhlci52YWx1ZSgpIDogb3RoZXIsIGN1c3RvbWl6ZXIsIGlzTG9vc2UsIHN0YWNrQSwgc3RhY2tCKTtcbiAgICB9XG4gIH1cbiAgaWYgKCFpc1NhbWVUYWcpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgLy8gQXNzdW1lIGN5Y2xpYyB2YWx1ZXMgYXJlIGVxdWFsLlxuICAvLyBGb3IgbW9yZSBpbmZvcm1hdGlvbiBvbiBkZXRlY3RpbmcgY2lyY3VsYXIgcmVmZXJlbmNlcyBzZWUgaHR0cHM6Ly9lczUuZ2l0aHViLmlvLyNKTy5cbiAgc3RhY2tBIHx8IChzdGFja0EgPSBbXSk7XG4gIHN0YWNrQiB8fCAoc3RhY2tCID0gW10pO1xuXG4gIHZhciBsZW5ndGggPSBzdGFja0EubGVuZ3RoO1xuICB3aGlsZSAobGVuZ3RoLS0pIHtcbiAgICBpZiAoc3RhY2tBW2xlbmd0aF0gPT0gb2JqZWN0KSB7XG4gICAgICByZXR1cm4gc3RhY2tCW2xlbmd0aF0gPT0gb3RoZXI7XG4gICAgfVxuICB9XG4gIC8vIEFkZCBgb2JqZWN0YCBhbmQgYG90aGVyYCB0byB0aGUgc3RhY2sgb2YgdHJhdmVyc2VkIG9iamVjdHMuXG4gIHN0YWNrQS5wdXNoKG9iamVjdCk7XG4gIHN0YWNrQi5wdXNoKG90aGVyKTtcblxuICB2YXIgcmVzdWx0ID0gKG9iaklzQXJyID8gZXF1YWxBcnJheXMgOiBlcXVhbE9iamVjdHMpKG9iamVjdCwgb3RoZXIsIGVxdWFsRnVuYywgY3VzdG9taXplciwgaXNMb29zZSwgc3RhY2tBLCBzdGFja0IpO1xuXG4gIHN0YWNrQS5wb3AoKTtcbiAgc3RhY2tCLnBvcCgpO1xuXG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUlzRXF1YWxEZWVwO1xuIiwidmFyIGJhc2VJc0VxdWFsID0gcmVxdWlyZSgnLi9iYXNlSXNFcXVhbCcpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmlzTWF0Y2hgIHdpdGhvdXQgc3VwcG9ydCBmb3IgY2FsbGJhY2tcbiAqIHNob3J0aGFuZHMgYW5kIGB0aGlzYCBiaW5kaW5nLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gaW5zcGVjdC5cbiAqIEBwYXJhbSB7QXJyYXl9IHByb3BzIFRoZSBzb3VyY2UgcHJvcGVydHkgbmFtZXMgdG8gbWF0Y2guXG4gKiBAcGFyYW0ge0FycmF5fSB2YWx1ZXMgVGhlIHNvdXJjZSB2YWx1ZXMgdG8gbWF0Y2guXG4gKiBAcGFyYW0ge0FycmF5fSBzdHJpY3RDb21wYXJlRmxhZ3MgU3RyaWN0IGNvbXBhcmlzb24gZmxhZ3MgZm9yIHNvdXJjZSB2YWx1ZXMuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY3VzdG9taXplcl0gVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBjb21wYXJpbmcgb2JqZWN0cy5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgb2JqZWN0YCBpcyBhIG1hdGNoLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VJc01hdGNoKG9iamVjdCwgcHJvcHMsIHZhbHVlcywgc3RyaWN0Q29tcGFyZUZsYWdzLCBjdXN0b21pemVyKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gcHJvcHMubGVuZ3RoLFxuICAgICAgbm9DdXN0b21pemVyID0gIWN1c3RvbWl6ZXI7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICBpZiAoKG5vQ3VzdG9taXplciAmJiBzdHJpY3RDb21wYXJlRmxhZ3NbaW5kZXhdKVxuICAgICAgICAgID8gdmFsdWVzW2luZGV4XSAhPT0gb2JqZWN0W3Byb3BzW2luZGV4XV1cbiAgICAgICAgICA6ICEocHJvcHNbaW5kZXhdIGluIG9iamVjdClcbiAgICAgICAgKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG4gIGluZGV4ID0gLTE7XG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdmFyIGtleSA9IHByb3BzW2luZGV4XSxcbiAgICAgICAgb2JqVmFsdWUgPSBvYmplY3Rba2V5XSxcbiAgICAgICAgc3JjVmFsdWUgPSB2YWx1ZXNbaW5kZXhdO1xuXG4gICAgaWYgKG5vQ3VzdG9taXplciAmJiBzdHJpY3RDb21wYXJlRmxhZ3NbaW5kZXhdKSB7XG4gICAgICB2YXIgcmVzdWx0ID0gb2JqVmFsdWUgIT09IHVuZGVmaW5lZCB8fCAoa2V5IGluIG9iamVjdCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc3VsdCA9IGN1c3RvbWl6ZXIgPyBjdXN0b21pemVyKG9ialZhbHVlLCBzcmNWYWx1ZSwga2V5KSA6IHVuZGVmaW5lZDtcbiAgICAgIGlmIChyZXN1bHQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXN1bHQgPSBiYXNlSXNFcXVhbChzcmNWYWx1ZSwgb2JqVmFsdWUsIGN1c3RvbWl6ZXIsIHRydWUpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoIXJlc3VsdCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlSXNNYXRjaDtcbiIsInZhciBiYXNlSXNNYXRjaCA9IHJlcXVpcmUoJy4vYmFzZUlzTWF0Y2gnKSxcbiAgICBjb25zdGFudCA9IHJlcXVpcmUoJy4uL3V0aWxpdHkvY29uc3RhbnQnKSxcbiAgICBpc1N0cmljdENvbXBhcmFibGUgPSByZXF1aXJlKCcuL2lzU3RyaWN0Q29tcGFyYWJsZScpLFxuICAgIGtleXMgPSByZXF1aXJlKCcuLi9vYmplY3Qva2V5cycpLFxuICAgIHRvT2JqZWN0ID0gcmVxdWlyZSgnLi90b09iamVjdCcpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLm1hdGNoZXNgIHdoaWNoIGRvZXMgbm90IGNsb25lIGBzb3VyY2VgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gc291cmNlIFRoZSBvYmplY3Qgb2YgcHJvcGVydHkgdmFsdWVzIHRvIG1hdGNoLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGJhc2VNYXRjaGVzKHNvdXJjZSkge1xuICB2YXIgcHJvcHMgPSBrZXlzKHNvdXJjZSksXG4gICAgICBsZW5ndGggPSBwcm9wcy5sZW5ndGg7XG5cbiAgaWYgKCFsZW5ndGgpIHtcbiAgICByZXR1cm4gY29uc3RhbnQodHJ1ZSk7XG4gIH1cbiAgaWYgKGxlbmd0aCA9PSAxKSB7XG4gICAgdmFyIGtleSA9IHByb3BzWzBdLFxuICAgICAgICB2YWx1ZSA9IHNvdXJjZVtrZXldO1xuXG4gICAgaWYgKGlzU3RyaWN0Q29tcGFyYWJsZSh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbihvYmplY3QpIHtcbiAgICAgICAgaWYgKG9iamVjdCA9PSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvYmplY3Rba2V5XSA9PT0gdmFsdWUgJiYgKHZhbHVlICE9PSB1bmRlZmluZWQgfHwgKGtleSBpbiB0b09iamVjdChvYmplY3QpKSk7XG4gICAgICB9O1xuICAgIH1cbiAgfVxuICB2YXIgdmFsdWVzID0gQXJyYXkobGVuZ3RoKSxcbiAgICAgIHN0cmljdENvbXBhcmVGbGFncyA9IEFycmF5KGxlbmd0aCk7XG5cbiAgd2hpbGUgKGxlbmd0aC0tKSB7XG4gICAgdmFsdWUgPSBzb3VyY2VbcHJvcHNbbGVuZ3RoXV07XG4gICAgdmFsdWVzW2xlbmd0aF0gPSB2YWx1ZTtcbiAgICBzdHJpY3RDb21wYXJlRmxhZ3NbbGVuZ3RoXSA9IGlzU3RyaWN0Q29tcGFyYWJsZSh2YWx1ZSk7XG4gIH1cbiAgcmV0dXJuIGZ1bmN0aW9uKG9iamVjdCkge1xuICAgIHJldHVybiBvYmplY3QgIT0gbnVsbCAmJiBiYXNlSXNNYXRjaCh0b09iamVjdChvYmplY3QpLCBwcm9wcywgdmFsdWVzLCBzdHJpY3RDb21wYXJlRmxhZ3MpO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VNYXRjaGVzO1xuIiwidmFyIGJhc2VHZXQgPSByZXF1aXJlKCcuL2Jhc2VHZXQnKSxcbiAgICBiYXNlSXNFcXVhbCA9IHJlcXVpcmUoJy4vYmFzZUlzRXF1YWwnKSxcbiAgICBiYXNlU2xpY2UgPSByZXF1aXJlKCcuL2Jhc2VTbGljZScpLFxuICAgIGlzQXJyYXkgPSByZXF1aXJlKCcuLi9sYW5nL2lzQXJyYXknKSxcbiAgICBpc0tleSA9IHJlcXVpcmUoJy4vaXNLZXknKSxcbiAgICBpc1N0cmljdENvbXBhcmFibGUgPSByZXF1aXJlKCcuL2lzU3RyaWN0Q29tcGFyYWJsZScpLFxuICAgIGxhc3QgPSByZXF1aXJlKCcuLi9hcnJheS9sYXN0JyksXG4gICAgdG9PYmplY3QgPSByZXF1aXJlKCcuL3RvT2JqZWN0JyksXG4gICAgdG9QYXRoID0gcmVxdWlyZSgnLi90b1BhdGgnKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5tYXRjaGVzUHJvcGVydHlgIHdoaWNoIGRvZXMgbm90IHdoaWNoIGRvZXNcbiAqIG5vdCBjbG9uZSBgdmFsdWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge3N0cmluZ30gcGF0aCBUaGUgcGF0aCBvZiB0aGUgcHJvcGVydHkgdG8gZ2V0LlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29tcGFyZS5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBiYXNlTWF0Y2hlc1Byb3BlcnR5KHBhdGgsIHZhbHVlKSB7XG4gIHZhciBpc0FyciA9IGlzQXJyYXkocGF0aCksXG4gICAgICBpc0NvbW1vbiA9IGlzS2V5KHBhdGgpICYmIGlzU3RyaWN0Q29tcGFyYWJsZSh2YWx1ZSksXG4gICAgICBwYXRoS2V5ID0gKHBhdGggKyAnJyk7XG5cbiAgcGF0aCA9IHRvUGF0aChwYXRoKTtcbiAgcmV0dXJuIGZ1bmN0aW9uKG9iamVjdCkge1xuICAgIGlmIChvYmplY3QgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICB2YXIga2V5ID0gcGF0aEtleTtcbiAgICBvYmplY3QgPSB0b09iamVjdChvYmplY3QpO1xuICAgIGlmICgoaXNBcnIgfHwgIWlzQ29tbW9uKSAmJiAhKGtleSBpbiBvYmplY3QpKSB7XG4gICAgICBvYmplY3QgPSBwYXRoLmxlbmd0aCA9PSAxID8gb2JqZWN0IDogYmFzZUdldChvYmplY3QsIGJhc2VTbGljZShwYXRoLCAwLCAtMSkpO1xuICAgICAgaWYgKG9iamVjdCA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGtleSA9IGxhc3QocGF0aCk7XG4gICAgICBvYmplY3QgPSB0b09iamVjdChvYmplY3QpO1xuICAgIH1cbiAgICByZXR1cm4gb2JqZWN0W2tleV0gPT09IHZhbHVlXG4gICAgICA/ICh2YWx1ZSAhPT0gdW5kZWZpbmVkIHx8IChrZXkgaW4gb2JqZWN0KSlcbiAgICAgIDogYmFzZUlzRXF1YWwodmFsdWUsIG9iamVjdFtrZXldLCBudWxsLCB0cnVlKTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlTWF0Y2hlc1Byb3BlcnR5O1xuIiwiLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5wcm9wZXJ0eWAgd2l0aG91dCBzdXBwb3J0IGZvciBkZWVwIHBhdGhzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHByb3BlcnR5IHRvIGdldC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBiYXNlUHJvcGVydHkoa2V5KSB7XG4gIHJldHVybiBmdW5jdGlvbihvYmplY3QpIHtcbiAgICByZXR1cm4gb2JqZWN0ID09IG51bGwgPyB1bmRlZmluZWQgOiBvYmplY3Rba2V5XTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlUHJvcGVydHk7XG4iLCJ2YXIgYmFzZUdldCA9IHJlcXVpcmUoJy4vYmFzZUdldCcpLFxuICAgIHRvUGF0aCA9IHJlcXVpcmUoJy4vdG9QYXRoJyk7XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBiYXNlUHJvcGVydHlgIHdoaWNoIHN1cHBvcnRzIGRlZXAgcGF0aHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl8c3RyaW5nfSBwYXRoIFRoZSBwYXRoIG9mIHRoZSBwcm9wZXJ0eSB0byBnZXQuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gYmFzZVByb3BlcnR5RGVlcChwYXRoKSB7XG4gIHZhciBwYXRoS2V5ID0gKHBhdGggKyAnJyk7XG4gIHBhdGggPSB0b1BhdGgocGF0aCk7XG4gIHJldHVybiBmdW5jdGlvbihvYmplY3QpIHtcbiAgICByZXR1cm4gYmFzZUdldChvYmplY3QsIHBhdGgsIHBhdGhLZXkpO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VQcm9wZXJ0eURlZXA7XG4iLCIvKiogTmF0aXZlIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIGZsb29yID0gTWF0aC5mbG9vcjtcblxuLyogTmF0aXZlIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVSYW5kb20gPSBNYXRoLnJhbmRvbTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5yYW5kb21gIHdpdGhvdXQgc3VwcG9ydCBmb3IgYXJndW1lbnQganVnZ2xpbmdcbiAqIGFuZCByZXR1cm5pbmcgZmxvYXRpbmctcG9pbnQgbnVtYmVycy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtudW1iZXJ9IG1pbiBUaGUgbWluaW11bSBwb3NzaWJsZSB2YWx1ZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBtYXggVGhlIG1heGltdW0gcG9zc2libGUgdmFsdWUuXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSByYW5kb20gbnVtYmVyLlxuICovXG5mdW5jdGlvbiBiYXNlUmFuZG9tKG1pbiwgbWF4KSB7XG4gIHJldHVybiBtaW4gKyBmbG9vcihuYXRpdmVSYW5kb20oKSAqIChtYXggLSBtaW4gKyAxKSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZVJhbmRvbTtcbiIsIi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uc2xpY2VgIHdpdGhvdXQgYW4gaXRlcmF0ZWUgY2FsbCBndWFyZC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIHNsaWNlLlxuICogQHBhcmFtIHtudW1iZXJ9IFtzdGFydD0wXSBUaGUgc3RhcnQgcG9zaXRpb24uXG4gKiBAcGFyYW0ge251bWJlcn0gW2VuZD1hcnJheS5sZW5ndGhdIFRoZSBlbmQgcG9zaXRpb24uXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIHNsaWNlIG9mIGBhcnJheWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VTbGljZShhcnJheSwgc3RhcnQsIGVuZCkge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IGFycmF5Lmxlbmd0aDtcblxuICBzdGFydCA9IHN0YXJ0ID09IG51bGwgPyAwIDogKCtzdGFydCB8fCAwKTtcbiAgaWYgKHN0YXJ0IDwgMCkge1xuICAgIHN0YXJ0ID0gLXN0YXJ0ID4gbGVuZ3RoID8gMCA6IChsZW5ndGggKyBzdGFydCk7XG4gIH1cbiAgZW5kID0gKGVuZCA9PT0gdW5kZWZpbmVkIHx8IGVuZCA+IGxlbmd0aCkgPyBsZW5ndGggOiAoK2VuZCB8fCAwKTtcbiAgaWYgKGVuZCA8IDApIHtcbiAgICBlbmQgKz0gbGVuZ3RoO1xuICB9XG4gIGxlbmd0aCA9IHN0YXJ0ID4gZW5kID8gMCA6ICgoZW5kIC0gc3RhcnQpID4+PiAwKTtcbiAgc3RhcnQgPj4+PSAwO1xuXG4gIHZhciByZXN1bHQgPSBBcnJheShsZW5ndGgpO1xuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHJlc3VsdFtpbmRleF0gPSBhcnJheVtpbmRleCArIHN0YXJ0XTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VTbGljZTtcbiIsIi8qKlxuICogQ29udmVydHMgYHZhbHVlYCB0byBhIHN0cmluZyBpZiBpdCBpcyBub3Qgb25lLiBBbiBlbXB0eSBzdHJpbmcgaXMgcmV0dXJuZWRcbiAqIGZvciBgbnVsbGAgb3IgYHVuZGVmaW5lZGAgdmFsdWVzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBwcm9jZXNzLlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgc3RyaW5nLlxuICovXG5mdW5jdGlvbiBiYXNlVG9TdHJpbmcodmFsdWUpIHtcbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PSAnc3RyaW5nJykge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuICByZXR1cm4gdmFsdWUgPT0gbnVsbCA/ICcnIDogKHZhbHVlICsgJycpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VUb1N0cmluZztcbiIsIi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8udmFsdWVzYCBhbmQgYF8udmFsdWVzSW5gIHdoaWNoIGNyZWF0ZXMgYW5cbiAqIGFycmF5IG9mIGBvYmplY3RgIHByb3BlcnR5IHZhbHVlcyBjb3JyZXNwb25kaW5nIHRvIHRoZSBwcm9wZXJ0eSBuYW1lc1xuICogb2YgYHByb3BzYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtBcnJheX0gcHJvcHMgVGhlIHByb3BlcnR5IG5hbWVzIHRvIGdldCB2YWx1ZXMgZm9yLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgdmFsdWVzLlxuICovXG5mdW5jdGlvbiBiYXNlVmFsdWVzKG9iamVjdCwgcHJvcHMpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBwcm9wcy5sZW5ndGgsXG4gICAgICByZXN1bHQgPSBBcnJheShsZW5ndGgpO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgcmVzdWx0W2luZGV4XSA9IG9iamVjdFtwcm9wc1tpbmRleF1dO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZVZhbHVlcztcbiIsInZhciBpZGVudGl0eSA9IHJlcXVpcmUoJy4uL3V0aWxpdHkvaWRlbnRpdHknKTtcblxuLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYGJhc2VDYWxsYmFja2Agd2hpY2ggb25seSBzdXBwb3J0cyBgdGhpc2AgYmluZGluZ1xuICogYW5kIHNwZWNpZnlpbmcgdGhlIG51bWJlciBvZiBhcmd1bWVudHMgdG8gcHJvdmlkZSB0byBgZnVuY2AuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGJpbmQuXG4gKiBAcGFyYW0geyp9IHRoaXNBcmcgVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBmdW5jYC5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbYXJnQ291bnRdIFRoZSBudW1iZXIgb2YgYXJndW1lbnRzIHRvIHByb3ZpZGUgdG8gYGZ1bmNgLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBjYWxsYmFjay5cbiAqL1xuZnVuY3Rpb24gYmluZENhbGxiYWNrKGZ1bmMsIHRoaXNBcmcsIGFyZ0NvdW50KSB7XG4gIGlmICh0eXBlb2YgZnVuYyAhPSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIGlkZW50aXR5O1xuICB9XG4gIGlmICh0aGlzQXJnID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gZnVuYztcbiAgfVxuICBzd2l0Y2ggKGFyZ0NvdW50KSB7XG4gICAgY2FzZSAxOiByZXR1cm4gZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHJldHVybiBmdW5jLmNhbGwodGhpc0FyZywgdmFsdWUpO1xuICAgIH07XG4gICAgY2FzZSAzOiByZXR1cm4gZnVuY3Rpb24odmFsdWUsIGluZGV4LCBjb2xsZWN0aW9uKSB7XG4gICAgICByZXR1cm4gZnVuYy5jYWxsKHRoaXNBcmcsIHZhbHVlLCBpbmRleCwgY29sbGVjdGlvbik7XG4gICAgfTtcbiAgICBjYXNlIDQ6IHJldHVybiBmdW5jdGlvbihhY2N1bXVsYXRvciwgdmFsdWUsIGluZGV4LCBjb2xsZWN0aW9uKSB7XG4gICAgICByZXR1cm4gZnVuYy5jYWxsKHRoaXNBcmcsIGFjY3VtdWxhdG9yLCB2YWx1ZSwgaW5kZXgsIGNvbGxlY3Rpb24pO1xuICAgIH07XG4gICAgY2FzZSA1OiByZXR1cm4gZnVuY3Rpb24odmFsdWUsIG90aGVyLCBrZXksIG9iamVjdCwgc291cmNlKSB7XG4gICAgICByZXR1cm4gZnVuYy5jYWxsKHRoaXNBcmcsIHZhbHVlLCBvdGhlciwga2V5LCBvYmplY3QsIHNvdXJjZSk7XG4gICAgfTtcbiAgfVxuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGZ1bmMuYXBwbHkodGhpc0FyZywgYXJndW1lbnRzKTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiaW5kQ2FsbGJhY2s7XG4iLCJ2YXIgZ2V0TGVuZ3RoID0gcmVxdWlyZSgnLi9nZXRMZW5ndGgnKSxcbiAgICBpc0xlbmd0aCA9IHJlcXVpcmUoJy4vaXNMZW5ndGgnKSxcbiAgICB0b09iamVjdCA9IHJlcXVpcmUoJy4vdG9PYmplY3QnKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgYGJhc2VFYWNoYCBvciBgYmFzZUVhY2hSaWdodGAgZnVuY3Rpb24uXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGVhY2hGdW5jIFRoZSBmdW5jdGlvbiB0byBpdGVyYXRlIG92ZXIgYSBjb2xsZWN0aW9uLlxuICogQHBhcmFtIHtib29sZWFufSBbZnJvbVJpZ2h0XSBTcGVjaWZ5IGl0ZXJhdGluZyBmcm9tIHJpZ2h0IHRvIGxlZnQuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBiYXNlIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBjcmVhdGVCYXNlRWFjaChlYWNoRnVuYywgZnJvbVJpZ2h0KSB7XG4gIHJldHVybiBmdW5jdGlvbihjb2xsZWN0aW9uLCBpdGVyYXRlZSkge1xuICAgIHZhciBsZW5ndGggPSBjb2xsZWN0aW9uID8gZ2V0TGVuZ3RoKGNvbGxlY3Rpb24pIDogMDtcbiAgICBpZiAoIWlzTGVuZ3RoKGxlbmd0aCkpIHtcbiAgICAgIHJldHVybiBlYWNoRnVuYyhjb2xsZWN0aW9uLCBpdGVyYXRlZSk7XG4gICAgfVxuICAgIHZhciBpbmRleCA9IGZyb21SaWdodCA/IGxlbmd0aCA6IC0xLFxuICAgICAgICBpdGVyYWJsZSA9IHRvT2JqZWN0KGNvbGxlY3Rpb24pO1xuXG4gICAgd2hpbGUgKChmcm9tUmlnaHQgPyBpbmRleC0tIDogKytpbmRleCA8IGxlbmd0aCkpIHtcbiAgICAgIGlmIChpdGVyYXRlZShpdGVyYWJsZVtpbmRleF0sIGluZGV4LCBpdGVyYWJsZSkgPT09IGZhbHNlKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gY29sbGVjdGlvbjtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVCYXNlRWFjaDtcbiIsInZhciB0b09iamVjdCA9IHJlcXVpcmUoJy4vdG9PYmplY3QnKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgYmFzZSBmdW5jdGlvbiBmb3IgYF8uZm9ySW5gIG9yIGBfLmZvckluUmlnaHRgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtmcm9tUmlnaHRdIFNwZWNpZnkgaXRlcmF0aW5nIGZyb20gcmlnaHQgdG8gbGVmdC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGJhc2UgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUJhc2VGb3IoZnJvbVJpZ2h0KSB7XG4gIHJldHVybiBmdW5jdGlvbihvYmplY3QsIGl0ZXJhdGVlLCBrZXlzRnVuYykge1xuICAgIHZhciBpdGVyYWJsZSA9IHRvT2JqZWN0KG9iamVjdCksXG4gICAgICAgIHByb3BzID0ga2V5c0Z1bmMob2JqZWN0KSxcbiAgICAgICAgbGVuZ3RoID0gcHJvcHMubGVuZ3RoLFxuICAgICAgICBpbmRleCA9IGZyb21SaWdodCA/IGxlbmd0aCA6IC0xO1xuXG4gICAgd2hpbGUgKChmcm9tUmlnaHQgPyBpbmRleC0tIDogKytpbmRleCA8IGxlbmd0aCkpIHtcbiAgICAgIHZhciBrZXkgPSBwcm9wc1tpbmRleF07XG4gICAgICBpZiAoaXRlcmF0ZWUoaXRlcmFibGVba2V5XSwga2V5LCBpdGVyYWJsZSkgPT09IGZhbHNlKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb2JqZWN0O1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZUJhc2VGb3I7XG4iLCIvKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgYmFzZUlzRXF1YWxEZWVwYCBmb3IgYXJyYXlzIHdpdGggc3VwcG9ydCBmb3JcbiAqIHBhcnRpYWwgZGVlcCBjb21wYXJpc29ucy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0ge0FycmF5fSBvdGhlciBUaGUgb3RoZXIgYXJyYXkgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGVxdWFsRnVuYyBUaGUgZnVuY3Rpb24gdG8gZGV0ZXJtaW5lIGVxdWl2YWxlbnRzIG9mIHZhbHVlcy5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjdXN0b21pemVyXSBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGNvbXBhcmluZyBhcnJheXMuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtpc0xvb3NlXSBTcGVjaWZ5IHBlcmZvcm1pbmcgcGFydGlhbCBjb21wYXJpc29ucy5cbiAqIEBwYXJhbSB7QXJyYXl9IFtzdGFja0FdIFRyYWNrcyB0cmF2ZXJzZWQgYHZhbHVlYCBvYmplY3RzLlxuICogQHBhcmFtIHtBcnJheX0gW3N0YWNrQl0gVHJhY2tzIHRyYXZlcnNlZCBgb3RoZXJgIG9iamVjdHMuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGFycmF5cyBhcmUgZXF1aXZhbGVudCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBlcXVhbEFycmF5cyhhcnJheSwgb3RoZXIsIGVxdWFsRnVuYywgY3VzdG9taXplciwgaXNMb29zZSwgc3RhY2tBLCBzdGFja0IpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBhcnJMZW5ndGggPSBhcnJheS5sZW5ndGgsXG4gICAgICBvdGhMZW5ndGggPSBvdGhlci5sZW5ndGgsXG4gICAgICByZXN1bHQgPSB0cnVlO1xuXG4gIGlmIChhcnJMZW5ndGggIT0gb3RoTGVuZ3RoICYmICEoaXNMb29zZSAmJiBvdGhMZW5ndGggPiBhcnJMZW5ndGgpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIC8vIERlZXAgY29tcGFyZSB0aGUgY29udGVudHMsIGlnbm9yaW5nIG5vbi1udW1lcmljIHByb3BlcnRpZXMuXG4gIHdoaWxlIChyZXN1bHQgJiYgKytpbmRleCA8IGFyckxlbmd0aCkge1xuICAgIHZhciBhcnJWYWx1ZSA9IGFycmF5W2luZGV4XSxcbiAgICAgICAgb3RoVmFsdWUgPSBvdGhlcltpbmRleF07XG5cbiAgICByZXN1bHQgPSB1bmRlZmluZWQ7XG4gICAgaWYgKGN1c3RvbWl6ZXIpIHtcbiAgICAgIHJlc3VsdCA9IGlzTG9vc2VcbiAgICAgICAgPyBjdXN0b21pemVyKG90aFZhbHVlLCBhcnJWYWx1ZSwgaW5kZXgpXG4gICAgICAgIDogY3VzdG9taXplcihhcnJWYWx1ZSwgb3RoVmFsdWUsIGluZGV4KTtcbiAgICB9XG4gICAgaWYgKHJlc3VsdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAvLyBSZWN1cnNpdmVseSBjb21wYXJlIGFycmF5cyAoc3VzY2VwdGlibGUgdG8gY2FsbCBzdGFjayBsaW1pdHMpLlxuICAgICAgaWYgKGlzTG9vc2UpIHtcbiAgICAgICAgdmFyIG90aEluZGV4ID0gb3RoTGVuZ3RoO1xuICAgICAgICB3aGlsZSAob3RoSW5kZXgtLSkge1xuICAgICAgICAgIG90aFZhbHVlID0gb3RoZXJbb3RoSW5kZXhdO1xuICAgICAgICAgIHJlc3VsdCA9IChhcnJWYWx1ZSAmJiBhcnJWYWx1ZSA9PT0gb3RoVmFsdWUpIHx8IGVxdWFsRnVuYyhhcnJWYWx1ZSwgb3RoVmFsdWUsIGN1c3RvbWl6ZXIsIGlzTG9vc2UsIHN0YWNrQSwgc3RhY2tCKTtcbiAgICAgICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3VsdCA9IChhcnJWYWx1ZSAmJiBhcnJWYWx1ZSA9PT0gb3RoVmFsdWUpIHx8IGVxdWFsRnVuYyhhcnJWYWx1ZSwgb3RoVmFsdWUsIGN1c3RvbWl6ZXIsIGlzTG9vc2UsIHN0YWNrQSwgc3RhY2tCKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuICEhcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGVxdWFsQXJyYXlzO1xuIiwiLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIGJvb2xUYWcgPSAnW29iamVjdCBCb29sZWFuXScsXG4gICAgZGF0ZVRhZyA9ICdbb2JqZWN0IERhdGVdJyxcbiAgICBlcnJvclRhZyA9ICdbb2JqZWN0IEVycm9yXScsXG4gICAgbnVtYmVyVGFnID0gJ1tvYmplY3QgTnVtYmVyXScsXG4gICAgcmVnZXhwVGFnID0gJ1tvYmplY3QgUmVnRXhwXScsXG4gICAgc3RyaW5nVGFnID0gJ1tvYmplY3QgU3RyaW5nXSc7XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBiYXNlSXNFcXVhbERlZXBgIGZvciBjb21wYXJpbmcgb2JqZWN0cyBvZlxuICogdGhlIHNhbWUgYHRvU3RyaW5nVGFnYC5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBmdW5jdGlvbiBvbmx5IHN1cHBvcnRzIGNvbXBhcmluZyB2YWx1ZXMgd2l0aCB0YWdzIG9mXG4gKiBgQm9vbGVhbmAsIGBEYXRlYCwgYEVycm9yYCwgYE51bWJlcmAsIGBSZWdFeHBgLCBvciBgU3RyaW5nYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IHZhbHVlIFRoZSBvYmplY3QgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBvdGhlciBUaGUgb3RoZXIgb2JqZWN0IHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0ge3N0cmluZ30gdGFnIFRoZSBgdG9TdHJpbmdUYWdgIG9mIHRoZSBvYmplY3RzIHRvIGNvbXBhcmUuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIG9iamVjdHMgYXJlIGVxdWl2YWxlbnQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gZXF1YWxCeVRhZyhvYmplY3QsIG90aGVyLCB0YWcpIHtcbiAgc3dpdGNoICh0YWcpIHtcbiAgICBjYXNlIGJvb2xUYWc6XG4gICAgY2FzZSBkYXRlVGFnOlxuICAgICAgLy8gQ29lcmNlIGRhdGVzIGFuZCBib29sZWFucyB0byBudW1iZXJzLCBkYXRlcyB0byBtaWxsaXNlY29uZHMgYW5kIGJvb2xlYW5zXG4gICAgICAvLyB0byBgMWAgb3IgYDBgIHRyZWF0aW5nIGludmFsaWQgZGF0ZXMgY29lcmNlZCB0byBgTmFOYCBhcyBub3QgZXF1YWwuXG4gICAgICByZXR1cm4gK29iamVjdCA9PSArb3RoZXI7XG5cbiAgICBjYXNlIGVycm9yVGFnOlxuICAgICAgcmV0dXJuIG9iamVjdC5uYW1lID09IG90aGVyLm5hbWUgJiYgb2JqZWN0Lm1lc3NhZ2UgPT0gb3RoZXIubWVzc2FnZTtcblxuICAgIGNhc2UgbnVtYmVyVGFnOlxuICAgICAgLy8gVHJlYXQgYE5hTmAgdnMuIGBOYU5gIGFzIGVxdWFsLlxuICAgICAgcmV0dXJuIChvYmplY3QgIT0gK29iamVjdClcbiAgICAgICAgPyBvdGhlciAhPSArb3RoZXJcbiAgICAgICAgOiBvYmplY3QgPT0gK290aGVyO1xuXG4gICAgY2FzZSByZWdleHBUYWc6XG4gICAgY2FzZSBzdHJpbmdUYWc6XG4gICAgICAvLyBDb2VyY2UgcmVnZXhlcyB0byBzdHJpbmdzIGFuZCB0cmVhdCBzdHJpbmdzIHByaW1pdGl2ZXMgYW5kIHN0cmluZ1xuICAgICAgLy8gb2JqZWN0cyBhcyBlcXVhbC4gU2VlIGh0dHBzOi8vZXM1LmdpdGh1Yi5pby8jeDE1LjEwLjYuNCBmb3IgbW9yZSBkZXRhaWxzLlxuICAgICAgcmV0dXJuIG9iamVjdCA9PSAob3RoZXIgKyAnJyk7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGVxdWFsQnlUYWc7XG4iLCJ2YXIga2V5cyA9IHJlcXVpcmUoJy4uL29iamVjdC9rZXlzJyk7XG5cbi8qKiBVc2VkIGZvciBuYXRpdmUgbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgYmFzZUlzRXF1YWxEZWVwYCBmb3Igb2JqZWN0cyB3aXRoIHN1cHBvcnQgZm9yXG4gKiBwYXJ0aWFsIGRlZXAgY29tcGFyaXNvbnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBjb21wYXJlLlxuICogQHBhcmFtIHtPYmplY3R9IG90aGVyIFRoZSBvdGhlciBvYmplY3QgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGVxdWFsRnVuYyBUaGUgZnVuY3Rpb24gdG8gZGV0ZXJtaW5lIGVxdWl2YWxlbnRzIG9mIHZhbHVlcy5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjdXN0b21pemVyXSBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGNvbXBhcmluZyB2YWx1ZXMuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtpc0xvb3NlXSBTcGVjaWZ5IHBlcmZvcm1pbmcgcGFydGlhbCBjb21wYXJpc29ucy5cbiAqIEBwYXJhbSB7QXJyYXl9IFtzdGFja0FdIFRyYWNrcyB0cmF2ZXJzZWQgYHZhbHVlYCBvYmplY3RzLlxuICogQHBhcmFtIHtBcnJheX0gW3N0YWNrQl0gVHJhY2tzIHRyYXZlcnNlZCBgb3RoZXJgIG9iamVjdHMuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIG9iamVjdHMgYXJlIGVxdWl2YWxlbnQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gZXF1YWxPYmplY3RzKG9iamVjdCwgb3RoZXIsIGVxdWFsRnVuYywgY3VzdG9taXplciwgaXNMb29zZSwgc3RhY2tBLCBzdGFja0IpIHtcbiAgdmFyIG9ialByb3BzID0ga2V5cyhvYmplY3QpLFxuICAgICAgb2JqTGVuZ3RoID0gb2JqUHJvcHMubGVuZ3RoLFxuICAgICAgb3RoUHJvcHMgPSBrZXlzKG90aGVyKSxcbiAgICAgIG90aExlbmd0aCA9IG90aFByb3BzLmxlbmd0aDtcblxuICBpZiAob2JqTGVuZ3RoICE9IG90aExlbmd0aCAmJiAhaXNMb29zZSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICB2YXIgc2tpcEN0b3IgPSBpc0xvb3NlLFxuICAgICAgaW5kZXggPSAtMTtcblxuICB3aGlsZSAoKytpbmRleCA8IG9iakxlbmd0aCkge1xuICAgIHZhciBrZXkgPSBvYmpQcm9wc1tpbmRleF0sXG4gICAgICAgIHJlc3VsdCA9IGlzTG9vc2UgPyBrZXkgaW4gb3RoZXIgOiBoYXNPd25Qcm9wZXJ0eS5jYWxsKG90aGVyLCBrZXkpO1xuXG4gICAgaWYgKHJlc3VsdCkge1xuICAgICAgdmFyIG9ialZhbHVlID0gb2JqZWN0W2tleV0sXG4gICAgICAgICAgb3RoVmFsdWUgPSBvdGhlcltrZXldO1xuXG4gICAgICByZXN1bHQgPSB1bmRlZmluZWQ7XG4gICAgICBpZiAoY3VzdG9taXplcikge1xuICAgICAgICByZXN1bHQgPSBpc0xvb3NlXG4gICAgICAgICAgPyBjdXN0b21pemVyKG90aFZhbHVlLCBvYmpWYWx1ZSwga2V5KVxuICAgICAgICAgIDogY3VzdG9taXplcihvYmpWYWx1ZSwgb3RoVmFsdWUsIGtleSk7XG4gICAgICB9XG4gICAgICBpZiAocmVzdWx0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgLy8gUmVjdXJzaXZlbHkgY29tcGFyZSBvYmplY3RzIChzdXNjZXB0aWJsZSB0byBjYWxsIHN0YWNrIGxpbWl0cykuXG4gICAgICAgIHJlc3VsdCA9IChvYmpWYWx1ZSAmJiBvYmpWYWx1ZSA9PT0gb3RoVmFsdWUpIHx8IGVxdWFsRnVuYyhvYmpWYWx1ZSwgb3RoVmFsdWUsIGN1c3RvbWl6ZXIsIGlzTG9vc2UsIHN0YWNrQSwgc3RhY2tCKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKCFyZXN1bHQpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgc2tpcEN0b3IgfHwgKHNraXBDdG9yID0ga2V5ID09ICdjb25zdHJ1Y3RvcicpO1xuICB9XG4gIGlmICghc2tpcEN0b3IpIHtcbiAgICB2YXIgb2JqQ3RvciA9IG9iamVjdC5jb25zdHJ1Y3RvcixcbiAgICAgICAgb3RoQ3RvciA9IG90aGVyLmNvbnN0cnVjdG9yO1xuXG4gICAgLy8gTm9uIGBPYmplY3RgIG9iamVjdCBpbnN0YW5jZXMgd2l0aCBkaWZmZXJlbnQgY29uc3RydWN0b3JzIGFyZSBub3QgZXF1YWwuXG4gICAgaWYgKG9iakN0b3IgIT0gb3RoQ3RvciAmJlxuICAgICAgICAoJ2NvbnN0cnVjdG9yJyBpbiBvYmplY3QgJiYgJ2NvbnN0cnVjdG9yJyBpbiBvdGhlcikgJiZcbiAgICAgICAgISh0eXBlb2Ygb2JqQ3RvciA9PSAnZnVuY3Rpb24nICYmIG9iakN0b3IgaW5zdGFuY2VvZiBvYmpDdG9yICYmXG4gICAgICAgICAgdHlwZW9mIG90aEN0b3IgPT0gJ2Z1bmN0aW9uJyAmJiBvdGhDdG9yIGluc3RhbmNlb2Ygb3RoQ3RvcikpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZXF1YWxPYmplY3RzO1xuIiwidmFyIGJhc2VQcm9wZXJ0eSA9IHJlcXVpcmUoJy4vYmFzZVByb3BlcnR5Jyk7XG5cbi8qKlxuICogR2V0cyB0aGUgXCJsZW5ndGhcIiBwcm9wZXJ0eSB2YWx1ZSBvZiBgb2JqZWN0YC5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBmdW5jdGlvbiBpcyB1c2VkIHRvIGF2b2lkIGEgW0pJVCBidWddKGh0dHBzOi8vYnVncy53ZWJraXQub3JnL3Nob3dfYnVnLmNnaT9pZD0xNDI3OTIpXG4gKiB0aGF0IGFmZmVjdHMgU2FmYXJpIG9uIGF0IGxlYXN0IGlPUyA4LjEtOC4zIEFSTTY0LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgXCJsZW5ndGhcIiB2YWx1ZS5cbiAqL1xudmFyIGdldExlbmd0aCA9IGJhc2VQcm9wZXJ0eSgnbGVuZ3RoJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0TGVuZ3RoO1xuIiwidmFyIGdldExlbmd0aCA9IHJlcXVpcmUoJy4vZ2V0TGVuZ3RoJyksXG4gICAgaXNMZW5ndGggPSByZXF1aXJlKCcuL2lzTGVuZ3RoJyk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYXJyYXktbGlrZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhcnJheS1saWtlLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzQXJyYXlMaWtlKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAhPSBudWxsICYmIGlzTGVuZ3RoKGdldExlbmd0aCh2YWx1ZSkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzQXJyYXlMaWtlO1xuIiwiLyoqXG4gKiBVc2VkIGFzIHRoZSBbbWF4aW11bSBsZW5ndGhdKGh0dHBzOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sI3NlYy1udW1iZXIubWF4X3NhZmVfaW50ZWdlcilcbiAqIG9mIGFuIGFycmF5LWxpa2UgdmFsdWUuXG4gKi9cbnZhciBNQVhfU0FGRV9JTlRFR0VSID0gTWF0aC5wb3coMiwgNTMpIC0gMTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGFycmF5LWxpa2UgaW5kZXguXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHBhcmFtIHtudW1iZXJ9IFtsZW5ndGg9TUFYX1NBRkVfSU5URUdFUl0gVGhlIHVwcGVyIGJvdW5kcyBvZiBhIHZhbGlkIGluZGV4LlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBpbmRleCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc0luZGV4KHZhbHVlLCBsZW5ndGgpIHtcbiAgdmFsdWUgPSArdmFsdWU7XG4gIGxlbmd0aCA9IGxlbmd0aCA9PSBudWxsID8gTUFYX1NBRkVfSU5URUdFUiA6IGxlbmd0aDtcbiAgcmV0dXJuIHZhbHVlID4gLTEgJiYgdmFsdWUgJSAxID09IDAgJiYgdmFsdWUgPCBsZW5ndGg7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNJbmRleDtcbiIsInZhciBpc0FycmF5TGlrZSA9IHJlcXVpcmUoJy4vaXNBcnJheUxpa2UnKSxcbiAgICBpc0luZGV4ID0gcmVxdWlyZSgnLi9pc0luZGV4JyksXG4gICAgaXNPYmplY3QgPSByZXF1aXJlKCcuLi9sYW5nL2lzT2JqZWN0Jyk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIHRoZSBwcm92aWRlZCBhcmd1bWVudHMgYXJlIGZyb20gYW4gaXRlcmF0ZWUgY2FsbC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgcG90ZW50aWFsIGl0ZXJhdGVlIHZhbHVlIGFyZ3VtZW50LlxuICogQHBhcmFtIHsqfSBpbmRleCBUaGUgcG90ZW50aWFsIGl0ZXJhdGVlIGluZGV4IG9yIGtleSBhcmd1bWVudC5cbiAqIEBwYXJhbSB7Kn0gb2JqZWN0IFRoZSBwb3RlbnRpYWwgaXRlcmF0ZWUgb2JqZWN0IGFyZ3VtZW50LlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBhcmd1bWVudHMgYXJlIGZyb20gYW4gaXRlcmF0ZWUgY2FsbCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc0l0ZXJhdGVlQ2FsbCh2YWx1ZSwgaW5kZXgsIG9iamVjdCkge1xuICBpZiAoIWlzT2JqZWN0KG9iamVjdCkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgdmFyIHR5cGUgPSB0eXBlb2YgaW5kZXg7XG4gIGlmICh0eXBlID09ICdudW1iZXInXG4gICAgICA/IChpc0FycmF5TGlrZShvYmplY3QpICYmIGlzSW5kZXgoaW5kZXgsIG9iamVjdC5sZW5ndGgpKVxuICAgICAgOiAodHlwZSA9PSAnc3RyaW5nJyAmJiBpbmRleCBpbiBvYmplY3QpKSB7XG4gICAgdmFyIG90aGVyID0gb2JqZWN0W2luZGV4XTtcbiAgICByZXR1cm4gdmFsdWUgPT09IHZhbHVlID8gKHZhbHVlID09PSBvdGhlcikgOiAob3RoZXIgIT09IG90aGVyKTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNJdGVyYXRlZUNhbGw7XG4iLCJ2YXIgaXNBcnJheSA9IHJlcXVpcmUoJy4uL2xhbmcvaXNBcnJheScpLFxuICAgIHRvT2JqZWN0ID0gcmVxdWlyZSgnLi90b09iamVjdCcpO1xuXG4vKiogVXNlZCB0byBtYXRjaCBwcm9wZXJ0eSBuYW1lcyB3aXRoaW4gcHJvcGVydHkgcGF0aHMuICovXG52YXIgcmVJc0RlZXBQcm9wID0gL1xcLnxcXFsoPzpbXltcXF1dKnwoW1wiJ10pKD86KD8hXFwxKVteXFxuXFxcXF18XFxcXC4pKj9cXDEpXFxdLyxcbiAgICByZUlzUGxhaW5Qcm9wID0gL15cXHcqJC87XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSBwcm9wZXJ0eSBuYW1lIGFuZCBub3QgYSBwcm9wZXJ0eSBwYXRoLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb2JqZWN0XSBUaGUgb2JqZWN0IHRvIHF1ZXJ5IGtleXMgb24uXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHByb3BlcnR5IG5hbWUsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNLZXkodmFsdWUsIG9iamVjdCkge1xuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgaWYgKCh0eXBlID09ICdzdHJpbmcnICYmIHJlSXNQbGFpblByb3AudGVzdCh2YWx1ZSkpIHx8IHR5cGUgPT0gJ251bWJlcicpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBpZiAoaXNBcnJheSh2YWx1ZSkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgdmFyIHJlc3VsdCA9ICFyZUlzRGVlcFByb3AudGVzdCh2YWx1ZSk7XG4gIHJldHVybiByZXN1bHQgfHwgKG9iamVjdCAhPSBudWxsICYmIHZhbHVlIGluIHRvT2JqZWN0KG9iamVjdCkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzS2V5O1xuIiwiLyoqXG4gKiBVc2VkIGFzIHRoZSBbbWF4aW11bSBsZW5ndGhdKGh0dHBzOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sI3NlYy1udW1iZXIubWF4X3NhZmVfaW50ZWdlcilcbiAqIG9mIGFuIGFycmF5LWxpa2UgdmFsdWUuXG4gKi9cbnZhciBNQVhfU0FGRV9JTlRFR0VSID0gTWF0aC5wb3coMiwgNTMpIC0gMTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGFycmF5LWxpa2UgbGVuZ3RoLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIGZ1bmN0aW9uIGlzIGJhc2VkIG9uIFtgVG9MZW5ndGhgXShodHRwczovL3Blb3BsZS5tb3ppbGxhLm9yZy9+am9yZW5kb3JmZi9lczYtZHJhZnQuaHRtbCNzZWMtdG9sZW5ndGgpLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgbGVuZ3RoLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzTGVuZ3RoKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicgJiYgdmFsdWUgPiAtMSAmJiB2YWx1ZSAlIDEgPT0gMCAmJiB2YWx1ZSA8PSBNQVhfU0FGRV9JTlRFR0VSO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzTGVuZ3RoO1xuIiwiLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZSwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc09iamVjdExpa2UodmFsdWUpIHtcbiAgcmV0dXJuICEhdmFsdWUgJiYgdHlwZW9mIHZhbHVlID09ICdvYmplY3QnO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzT2JqZWN0TGlrZTtcbiIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4uL2xhbmcvaXNPYmplY3QnKTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBzdWl0YWJsZSBmb3Igc3RyaWN0IGVxdWFsaXR5IGNvbXBhcmlzb25zLCBpLmUuIGA9PT1gLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlmIHN1aXRhYmxlIGZvciBzdHJpY3RcbiAqICBlcXVhbGl0eSBjb21wYXJpc29ucywgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc1N0cmljdENvbXBhcmFibGUodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlID09PSB2YWx1ZSAmJiAhaXNPYmplY3QodmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzU3RyaWN0Q29tcGFyYWJsZTtcbiIsInZhciBpc0FyZ3VtZW50cyA9IHJlcXVpcmUoJy4uL2xhbmcvaXNBcmd1bWVudHMnKSxcbiAgICBpc0FycmF5ID0gcmVxdWlyZSgnLi4vbGFuZy9pc0FycmF5JyksXG4gICAgaXNJbmRleCA9IHJlcXVpcmUoJy4vaXNJbmRleCcpLFxuICAgIGlzTGVuZ3RoID0gcmVxdWlyZSgnLi9pc0xlbmd0aCcpLFxuICAgIGtleXNJbiA9IHJlcXVpcmUoJy4uL29iamVjdC9rZXlzSW4nKSxcbiAgICBzdXBwb3J0ID0gcmVxdWlyZSgnLi4vc3VwcG9ydCcpO1xuXG4vKiogVXNlZCBmb3IgbmF0aXZlIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBBIGZhbGxiYWNrIGltcGxlbWVudGF0aW9uIG9mIGBPYmplY3Qua2V5c2Agd2hpY2ggY3JlYXRlcyBhbiBhcnJheSBvZiB0aGVcbiAqIG93biBlbnVtZXJhYmxlIHByb3BlcnR5IG5hbWVzIG9mIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICovXG5mdW5jdGlvbiBzaGltS2V5cyhvYmplY3QpIHtcbiAgdmFyIHByb3BzID0ga2V5c0luKG9iamVjdCksXG4gICAgICBwcm9wc0xlbmd0aCA9IHByb3BzLmxlbmd0aCxcbiAgICAgIGxlbmd0aCA9IHByb3BzTGVuZ3RoICYmIG9iamVjdC5sZW5ndGg7XG5cbiAgdmFyIGFsbG93SW5kZXhlcyA9IGxlbmd0aCAmJiBpc0xlbmd0aChsZW5ndGgpICYmXG4gICAgKGlzQXJyYXkob2JqZWN0KSB8fCAoc3VwcG9ydC5ub25FbnVtQXJncyAmJiBpc0FyZ3VtZW50cyhvYmplY3QpKSk7XG5cbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICByZXN1bHQgPSBbXTtcblxuICB3aGlsZSAoKytpbmRleCA8IHByb3BzTGVuZ3RoKSB7XG4gICAgdmFyIGtleSA9IHByb3BzW2luZGV4XTtcbiAgICBpZiAoKGFsbG93SW5kZXhlcyAmJiBpc0luZGV4KGtleSwgbGVuZ3RoKSkgfHwgaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIGtleSkpIHtcbiAgICAgIHJlc3VsdC5wdXNoKGtleSk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc2hpbUtleXM7XG4iLCJ2YXIgaXNBcnJheUxpa2UgPSByZXF1aXJlKCcuL2lzQXJyYXlMaWtlJyksXG4gICAgaXNPYmplY3QgPSByZXF1aXJlKCcuLi9sYW5nL2lzT2JqZWN0JyksXG4gICAgdmFsdWVzID0gcmVxdWlyZSgnLi4vb2JqZWN0L3ZhbHVlcycpO1xuXG4vKipcbiAqIENvbnZlcnRzIGB2YWx1ZWAgdG8gYW4gYXJyYXktbGlrZSBvYmplY3QgaWYgaXQgaXMgbm90IG9uZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcHJvY2Vzcy5cbiAqIEByZXR1cm5zIHtBcnJheXxPYmplY3R9IFJldHVybnMgdGhlIGFycmF5LWxpa2Ugb2JqZWN0LlxuICovXG5mdW5jdGlvbiB0b0l0ZXJhYmxlKHZhbHVlKSB7XG4gIGlmICh2YWx1ZSA9PSBudWxsKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG4gIGlmICghaXNBcnJheUxpa2UodmFsdWUpKSB7XG4gICAgcmV0dXJuIHZhbHVlcyh2YWx1ZSk7XG4gIH1cbiAgcmV0dXJuIGlzT2JqZWN0KHZhbHVlKSA/IHZhbHVlIDogT2JqZWN0KHZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB0b0l0ZXJhYmxlO1xuIiwidmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi4vbGFuZy9pc09iamVjdCcpO1xuXG4vKipcbiAqIENvbnZlcnRzIGB2YWx1ZWAgdG8gYW4gb2JqZWN0IGlmIGl0IGlzIG5vdCBvbmUuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHByb2Nlc3MuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBvYmplY3QuXG4gKi9cbmZ1bmN0aW9uIHRvT2JqZWN0KHZhbHVlKSB7XG4gIHJldHVybiBpc09iamVjdCh2YWx1ZSkgPyB2YWx1ZSA6IE9iamVjdCh2YWx1ZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdG9PYmplY3Q7XG4iLCJ2YXIgYmFzZVRvU3RyaW5nID0gcmVxdWlyZSgnLi9iYXNlVG9TdHJpbmcnKSxcbiAgICBpc0FycmF5ID0gcmVxdWlyZSgnLi4vbGFuZy9pc0FycmF5Jyk7XG5cbi8qKiBVc2VkIHRvIG1hdGNoIHByb3BlcnR5IG5hbWVzIHdpdGhpbiBwcm9wZXJ0eSBwYXRocy4gKi9cbnZhciByZVByb3BOYW1lID0gL1teLltcXF1dK3xcXFsoPzooLT9cXGQrKD86XFwuXFxkKyk/KXwoW1wiJ10pKCg/Oig/IVxcMilbXlxcblxcXFxdfFxcXFwuKSo/KVxcMilcXF0vZztcblxuLyoqIFVzZWQgdG8gbWF0Y2ggYmFja3NsYXNoZXMgaW4gcHJvcGVydHkgcGF0aHMuICovXG52YXIgcmVFc2NhcGVDaGFyID0gL1xcXFwoXFxcXCk/L2c7XG5cbi8qKlxuICogQ29udmVydHMgYHZhbHVlYCB0byBwcm9wZXJ0eSBwYXRoIGFycmF5IGlmIGl0IGlzIG5vdCBvbmUuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHByb2Nlc3MuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIHByb3BlcnR5IHBhdGggYXJyYXkuXG4gKi9cbmZ1bmN0aW9uIHRvUGF0aCh2YWx1ZSkge1xuICBpZiAoaXNBcnJheSh2YWx1ZSkpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgdmFyIHJlc3VsdCA9IFtdO1xuICBiYXNlVG9TdHJpbmcodmFsdWUpLnJlcGxhY2UocmVQcm9wTmFtZSwgZnVuY3Rpb24obWF0Y2gsIG51bWJlciwgcXVvdGUsIHN0cmluZykge1xuICAgIHJlc3VsdC5wdXNoKHF1b3RlID8gc3RyaW5nLnJlcGxhY2UocmVFc2NhcGVDaGFyLCAnJDEnKSA6IChudW1iZXIgfHwgbWF0Y2gpKTtcbiAgfSk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdG9QYXRoO1xuIiwidmFyIGlzQXJyYXlMaWtlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWwvaXNBcnJheUxpa2UnKSxcbiAgICBpc09iamVjdExpa2UgPSByZXF1aXJlKCcuLi9pbnRlcm5hbC9pc09iamVjdExpa2UnKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIGFyZ3NUYWcgPSAnW29iamVjdCBBcmd1bWVudHNdJztcblxuLyoqIFVzZWQgZm9yIG5hdGl2ZSBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKlxuICogVXNlZCB0byByZXNvbHZlIHRoZSBbYHRvU3RyaW5nVGFnYF0oaHR0cHM6Ly9wZW9wbGUubW96aWxsYS5vcmcvfmpvcmVuZG9yZmYvZXM2LWRyYWZ0Lmh0bWwjc2VjLW9iamVjdC5wcm90b3R5cGUudG9zdHJpbmcpXG4gKiBvZiB2YWx1ZXMuXG4gKi9cbnZhciBvYmpUb1N0cmluZyA9IG9iamVjdFByb3RvLnRvU3RyaW5nO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYW4gYGFyZ3VtZW50c2Agb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBjb3JyZWN0bHkgY2xhc3NpZmllZCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzQXJndW1lbnRzKGZ1bmN0aW9uKCkgeyByZXR1cm4gYXJndW1lbnRzOyB9KCkpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcmd1bWVudHMoWzEsIDIsIDNdKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzQXJndW1lbnRzKHZhbHVlKSB7XG4gIHJldHVybiBpc09iamVjdExpa2UodmFsdWUpICYmIGlzQXJyYXlMaWtlKHZhbHVlKSAmJiBvYmpUb1N0cmluZy5jYWxsKHZhbHVlKSA9PSBhcmdzVGFnO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzQXJndW1lbnRzO1xuIiwidmFyIGlzTGVuZ3RoID0gcmVxdWlyZSgnLi4vaW50ZXJuYWwvaXNMZW5ndGgnKSxcbiAgICBpc05hdGl2ZSA9IHJlcXVpcmUoJy4vaXNOYXRpdmUnKSxcbiAgICBpc09iamVjdExpa2UgPSByZXF1aXJlKCcuLi9pbnRlcm5hbC9pc09iamVjdExpa2UnKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIGFycmF5VGFnID0gJ1tvYmplY3QgQXJyYXldJztcblxuLyoqIFVzZWQgZm9yIG5hdGl2ZSBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKlxuICogVXNlZCB0byByZXNvbHZlIHRoZSBbYHRvU3RyaW5nVGFnYF0oaHR0cHM6Ly9wZW9wbGUubW96aWxsYS5vcmcvfmpvcmVuZG9yZmYvZXM2LWRyYWZ0Lmh0bWwjc2VjLW9iamVjdC5wcm90b3R5cGUudG9zdHJpbmcpXG4gKiBvZiB2YWx1ZXMuXG4gKi9cbnZhciBvYmpUb1N0cmluZyA9IG9iamVjdFByb3RvLnRvU3RyaW5nO1xuXG4vKiBOYXRpdmUgbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xudmFyIG5hdGl2ZUlzQXJyYXkgPSBpc05hdGl2ZShuYXRpdmVJc0FycmF5ID0gQXJyYXkuaXNBcnJheSkgJiYgbmF0aXZlSXNBcnJheTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGFuIGBBcnJheWAgb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBjb3JyZWN0bHkgY2xhc3NpZmllZCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzQXJyYXkoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJyYXkoZnVuY3Rpb24oKSB7IHJldHVybiBhcmd1bWVudHM7IH0oKSk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG52YXIgaXNBcnJheSA9IG5hdGl2ZUlzQXJyYXkgfHwgZnVuY3Rpb24odmFsdWUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgaXNMZW5ndGgodmFsdWUubGVuZ3RoKSAmJiBvYmpUb1N0cmluZy5jYWxsKHZhbHVlKSA9PSBhcnJheVRhZztcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gaXNBcnJheTtcbiIsInZhciBlc2NhcGVSZWdFeHAgPSByZXF1aXJlKCcuLi9zdHJpbmcvZXNjYXBlUmVnRXhwJyksXG4gICAgaXNPYmplY3RMaWtlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWwvaXNPYmplY3RMaWtlJyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBmdW5jVGFnID0gJ1tvYmplY3QgRnVuY3Rpb25dJztcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IGhvc3QgY29uc3RydWN0b3JzIChTYWZhcmkgPiA1KS4gKi9cbnZhciByZUlzSG9zdEN0b3IgPSAvXlxcW29iamVjdCAuKz9Db25zdHJ1Y3RvclxcXSQvO1xuXG4vKiogVXNlZCBmb3IgbmF0aXZlIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gcmVzb2x2ZSB0aGUgZGVjb21waWxlZCBzb3VyY2Ugb2YgZnVuY3Rpb25zLiAqL1xudmFyIGZuVG9TdHJpbmcgPSBGdW5jdGlvbi5wcm90b3R5cGUudG9TdHJpbmc7XG5cbi8qKlxuICogVXNlZCB0byByZXNvbHZlIHRoZSBbYHRvU3RyaW5nVGFnYF0oaHR0cHM6Ly9wZW9wbGUubW96aWxsYS5vcmcvfmpvcmVuZG9yZmYvZXM2LWRyYWZ0Lmh0bWwjc2VjLW9iamVjdC5wcm90b3R5cGUudG9zdHJpbmcpXG4gKiBvZiB2YWx1ZXMuXG4gKi9cbnZhciBvYmpUb1N0cmluZyA9IG9iamVjdFByb3RvLnRvU3RyaW5nO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgaWYgYSBtZXRob2QgaXMgbmF0aXZlLiAqL1xudmFyIHJlSXNOYXRpdmUgPSBSZWdFeHAoJ14nICtcbiAgZXNjYXBlUmVnRXhwKG9ialRvU3RyaW5nKVxuICAucmVwbGFjZSgvdG9TdHJpbmd8KGZ1bmN0aW9uKS4qPyg/PVxcXFxcXCgpfCBmb3IgLis/KD89XFxcXFxcXSkvZywgJyQxLio/JykgKyAnJCdcbik7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSBuYXRpdmUgZnVuY3Rpb24uXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgbmF0aXZlIGZ1bmN0aW9uLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNOYXRpdmUoQXJyYXkucHJvdG90eXBlLnB1c2gpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNOYXRpdmUoXyk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc05hdGl2ZSh2YWx1ZSkge1xuICBpZiAodmFsdWUgPT0gbnVsbCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBpZiAob2JqVG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT0gZnVuY1RhZykge1xuICAgIHJldHVybiByZUlzTmF0aXZlLnRlc3QoZm5Ub1N0cmluZy5jYWxsKHZhbHVlKSk7XG4gIH1cbiAgcmV0dXJuIGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgcmVJc0hvc3RDdG9yLnRlc3QodmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzTmF0aXZlO1xuIiwiLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyB0aGUgW2xhbmd1YWdlIHR5cGVdKGh0dHBzOi8vZXM1LmdpdGh1Yi5pby8jeDgpIG9mIGBPYmplY3RgLlxuICogKGUuZy4gYXJyYXlzLCBmdW5jdGlvbnMsIG9iamVjdHMsIHJlZ2V4ZXMsIGBuZXcgTnVtYmVyKDApYCwgYW5kIGBuZXcgU3RyaW5nKCcnKWApXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIG9iamVjdCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzT2JqZWN0KHt9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdCgxKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0KHZhbHVlKSB7XG4gIC8vIEF2b2lkIGEgVjggSklUIGJ1ZyBpbiBDaHJvbWUgMTktMjAuXG4gIC8vIFNlZSBodHRwczovL2NvZGUuZ29vZ2xlLmNvbS9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9MjI5MSBmb3IgbW9yZSBkZXRhaWxzLlxuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgcmV0dXJuIHR5cGUgPT0gJ2Z1bmN0aW9uJyB8fCAoISF2YWx1ZSAmJiB0eXBlID09ICdvYmplY3QnKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc09iamVjdDtcbiIsInZhciBpc0xlbmd0aCA9IHJlcXVpcmUoJy4uL2ludGVybmFsL2lzTGVuZ3RoJyksXG4gICAgaXNPYmplY3RMaWtlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWwvaXNPYmplY3RMaWtlJyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBhcmdzVGFnID0gJ1tvYmplY3QgQXJndW1lbnRzXScsXG4gICAgYXJyYXlUYWcgPSAnW29iamVjdCBBcnJheV0nLFxuICAgIGJvb2xUYWcgPSAnW29iamVjdCBCb29sZWFuXScsXG4gICAgZGF0ZVRhZyA9ICdbb2JqZWN0IERhdGVdJyxcbiAgICBlcnJvclRhZyA9ICdbb2JqZWN0IEVycm9yXScsXG4gICAgZnVuY1RhZyA9ICdbb2JqZWN0IEZ1bmN0aW9uXScsXG4gICAgbWFwVGFnID0gJ1tvYmplY3QgTWFwXScsXG4gICAgbnVtYmVyVGFnID0gJ1tvYmplY3QgTnVtYmVyXScsXG4gICAgb2JqZWN0VGFnID0gJ1tvYmplY3QgT2JqZWN0XScsXG4gICAgcmVnZXhwVGFnID0gJ1tvYmplY3QgUmVnRXhwXScsXG4gICAgc2V0VGFnID0gJ1tvYmplY3QgU2V0XScsXG4gICAgc3RyaW5nVGFnID0gJ1tvYmplY3QgU3RyaW5nXScsXG4gICAgd2Vha01hcFRhZyA9ICdbb2JqZWN0IFdlYWtNYXBdJztcblxudmFyIGFycmF5QnVmZmVyVGFnID0gJ1tvYmplY3QgQXJyYXlCdWZmZXJdJyxcbiAgICBmbG9hdDMyVGFnID0gJ1tvYmplY3QgRmxvYXQzMkFycmF5XScsXG4gICAgZmxvYXQ2NFRhZyA9ICdbb2JqZWN0IEZsb2F0NjRBcnJheV0nLFxuICAgIGludDhUYWcgPSAnW29iamVjdCBJbnQ4QXJyYXldJyxcbiAgICBpbnQxNlRhZyA9ICdbb2JqZWN0IEludDE2QXJyYXldJyxcbiAgICBpbnQzMlRhZyA9ICdbb2JqZWN0IEludDMyQXJyYXldJyxcbiAgICB1aW50OFRhZyA9ICdbb2JqZWN0IFVpbnQ4QXJyYXldJyxcbiAgICB1aW50OENsYW1wZWRUYWcgPSAnW29iamVjdCBVaW50OENsYW1wZWRBcnJheV0nLFxuICAgIHVpbnQxNlRhZyA9ICdbb2JqZWN0IFVpbnQxNkFycmF5XScsXG4gICAgdWludDMyVGFnID0gJ1tvYmplY3QgVWludDMyQXJyYXldJztcblxuLyoqIFVzZWQgdG8gaWRlbnRpZnkgYHRvU3RyaW5nVGFnYCB2YWx1ZXMgb2YgdHlwZWQgYXJyYXlzLiAqL1xudmFyIHR5cGVkQXJyYXlUYWdzID0ge307XG50eXBlZEFycmF5VGFnc1tmbG9hdDMyVGFnXSA9IHR5cGVkQXJyYXlUYWdzW2Zsb2F0NjRUYWddID1cbnR5cGVkQXJyYXlUYWdzW2ludDhUYWddID0gdHlwZWRBcnJheVRhZ3NbaW50MTZUYWddID1cbnR5cGVkQXJyYXlUYWdzW2ludDMyVGFnXSA9IHR5cGVkQXJyYXlUYWdzW3VpbnQ4VGFnXSA9XG50eXBlZEFycmF5VGFnc1t1aW50OENsYW1wZWRUYWddID0gdHlwZWRBcnJheVRhZ3NbdWludDE2VGFnXSA9XG50eXBlZEFycmF5VGFnc1t1aW50MzJUYWddID0gdHJ1ZTtcbnR5cGVkQXJyYXlUYWdzW2FyZ3NUYWddID0gdHlwZWRBcnJheVRhZ3NbYXJyYXlUYWddID1cbnR5cGVkQXJyYXlUYWdzW2FycmF5QnVmZmVyVGFnXSA9IHR5cGVkQXJyYXlUYWdzW2Jvb2xUYWddID1cbnR5cGVkQXJyYXlUYWdzW2RhdGVUYWddID0gdHlwZWRBcnJheVRhZ3NbZXJyb3JUYWddID1cbnR5cGVkQXJyYXlUYWdzW2Z1bmNUYWddID0gdHlwZWRBcnJheVRhZ3NbbWFwVGFnXSA9XG50eXBlZEFycmF5VGFnc1tudW1iZXJUYWddID0gdHlwZWRBcnJheVRhZ3Nbb2JqZWN0VGFnXSA9XG50eXBlZEFycmF5VGFnc1tyZWdleHBUYWddID0gdHlwZWRBcnJheVRhZ3Nbc2V0VGFnXSA9XG50eXBlZEFycmF5VGFnc1tzdHJpbmdUYWddID0gdHlwZWRBcnJheVRhZ3Nbd2Vha01hcFRhZ10gPSBmYWxzZTtcblxuLyoqIFVzZWQgZm9yIG5hdGl2ZSBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKlxuICogVXNlZCB0byByZXNvbHZlIHRoZSBbYHRvU3RyaW5nVGFnYF0oaHR0cHM6Ly9wZW9wbGUubW96aWxsYS5vcmcvfmpvcmVuZG9yZmYvZXM2LWRyYWZ0Lmh0bWwjc2VjLW9iamVjdC5wcm90b3R5cGUudG9zdHJpbmcpXG4gKiBvZiB2YWx1ZXMuXG4gKi9cbnZhciBvYmpUb1N0cmluZyA9IG9iamVjdFByb3RvLnRvU3RyaW5nO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSB0eXBlZCBhcnJheS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgY29ycmVjdGx5IGNsYXNzaWZpZWQsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc1R5cGVkQXJyYXkobmV3IFVpbnQ4QXJyYXkpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNUeXBlZEFycmF5KFtdKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzVHlwZWRBcnJheSh2YWx1ZSkge1xuICByZXR1cm4gaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBpc0xlbmd0aCh2YWx1ZS5sZW5ndGgpICYmICEhdHlwZWRBcnJheVRhZ3Nbb2JqVG9TdHJpbmcuY2FsbCh2YWx1ZSldO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzVHlwZWRBcnJheTtcbiIsInZhciBpc0FycmF5TGlrZSA9IHJlcXVpcmUoJy4uL2ludGVybmFsL2lzQXJyYXlMaWtlJyksXG4gICAgaXNOYXRpdmUgPSByZXF1aXJlKCcuLi9sYW5nL2lzTmF0aXZlJyksXG4gICAgaXNPYmplY3QgPSByZXF1aXJlKCcuLi9sYW5nL2lzT2JqZWN0JyksXG4gICAgc2hpbUtleXMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbC9zaGltS2V5cycpO1xuXG4vKiBOYXRpdmUgbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xudmFyIG5hdGl2ZUtleXMgPSBpc05hdGl2ZShuYXRpdmVLZXlzID0gT2JqZWN0LmtleXMpICYmIG5hdGl2ZUtleXM7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiB0aGUgb3duIGVudW1lcmFibGUgcHJvcGVydHkgbmFtZXMgb2YgYG9iamVjdGAuXG4gKlxuICogKipOb3RlOioqIE5vbi1vYmplY3QgdmFsdWVzIGFyZSBjb2VyY2VkIHRvIG9iamVjdHMuIFNlZSB0aGVcbiAqIFtFUyBzcGVjXShodHRwczovL3Blb3BsZS5tb3ppbGxhLm9yZy9+am9yZW5kb3JmZi9lczYtZHJhZnQuaHRtbCNzZWMtb2JqZWN0LmtleXMpXG4gKiBmb3IgbW9yZSBkZXRhaWxzLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICogQGV4YW1wbGVcbiAqXG4gKiBmdW5jdGlvbiBGb28oKSB7XG4gKiAgIHRoaXMuYSA9IDE7XG4gKiAgIHRoaXMuYiA9IDI7XG4gKiB9XG4gKlxuICogRm9vLnByb3RvdHlwZS5jID0gMztcbiAqXG4gKiBfLmtleXMobmV3IEZvbyk7XG4gKiAvLyA9PiBbJ2EnLCAnYiddIChpdGVyYXRpb24gb3JkZXIgaXMgbm90IGd1YXJhbnRlZWQpXG4gKlxuICogXy5rZXlzKCdoaScpO1xuICogLy8gPT4gWycwJywgJzEnXVxuICovXG52YXIga2V5cyA9ICFuYXRpdmVLZXlzID8gc2hpbUtleXMgOiBmdW5jdGlvbihvYmplY3QpIHtcbiAgdmFyIEN0b3IgPSBvYmplY3QgIT0gbnVsbCAmJiBvYmplY3QuY29uc3RydWN0b3I7XG4gIGlmICgodHlwZW9mIEN0b3IgPT0gJ2Z1bmN0aW9uJyAmJiBDdG9yLnByb3RvdHlwZSA9PT0gb2JqZWN0KSB8fFxuICAgICAgKHR5cGVvZiBvYmplY3QgIT0gJ2Z1bmN0aW9uJyAmJiBpc0FycmF5TGlrZShvYmplY3QpKSkge1xuICAgIHJldHVybiBzaGltS2V5cyhvYmplY3QpO1xuICB9XG4gIHJldHVybiBpc09iamVjdChvYmplY3QpID8gbmF0aXZlS2V5cyhvYmplY3QpIDogW107XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGtleXM7XG4iLCJ2YXIgaXNBcmd1bWVudHMgPSByZXF1aXJlKCcuLi9sYW5nL2lzQXJndW1lbnRzJyksXG4gICAgaXNBcnJheSA9IHJlcXVpcmUoJy4uL2xhbmcvaXNBcnJheScpLFxuICAgIGlzSW5kZXggPSByZXF1aXJlKCcuLi9pbnRlcm5hbC9pc0luZGV4JyksXG4gICAgaXNMZW5ndGggPSByZXF1aXJlKCcuLi9pbnRlcm5hbC9pc0xlbmd0aCcpLFxuICAgIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi4vbGFuZy9pc09iamVjdCcpLFxuICAgIHN1cHBvcnQgPSByZXF1aXJlKCcuLi9zdXBwb3J0Jyk7XG5cbi8qKiBVc2VkIGZvciBuYXRpdmUgbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gYXJyYXkgb2YgdGhlIG93biBhbmQgaW5oZXJpdGVkIGVudW1lcmFibGUgcHJvcGVydHkgbmFtZXMgb2YgYG9iamVjdGAuXG4gKlxuICogKipOb3RlOioqIE5vbi1vYmplY3QgdmFsdWVzIGFyZSBjb2VyY2VkIHRvIG9iamVjdHMuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBPYmplY3RcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMuXG4gKiBAZXhhbXBsZVxuICpcbiAqIGZ1bmN0aW9uIEZvbygpIHtcbiAqICAgdGhpcy5hID0gMTtcbiAqICAgdGhpcy5iID0gMjtcbiAqIH1cbiAqXG4gKiBGb28ucHJvdG90eXBlLmMgPSAzO1xuICpcbiAqIF8ua2V5c0luKG5ldyBGb28pO1xuICogLy8gPT4gWydhJywgJ2InLCAnYyddIChpdGVyYXRpb24gb3JkZXIgaXMgbm90IGd1YXJhbnRlZWQpXG4gKi9cbmZ1bmN0aW9uIGtleXNJbihvYmplY3QpIHtcbiAgaWYgKG9iamVjdCA9PSBudWxsKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG4gIGlmICghaXNPYmplY3Qob2JqZWN0KSkge1xuICAgIG9iamVjdCA9IE9iamVjdChvYmplY3QpO1xuICB9XG4gIHZhciBsZW5ndGggPSBvYmplY3QubGVuZ3RoO1xuICBsZW5ndGggPSAobGVuZ3RoICYmIGlzTGVuZ3RoKGxlbmd0aCkgJiZcbiAgICAoaXNBcnJheShvYmplY3QpIHx8IChzdXBwb3J0Lm5vbkVudW1BcmdzICYmIGlzQXJndW1lbnRzKG9iamVjdCkpKSAmJiBsZW5ndGgpIHx8IDA7XG5cbiAgdmFyIEN0b3IgPSBvYmplY3QuY29uc3RydWN0b3IsXG4gICAgICBpbmRleCA9IC0xLFxuICAgICAgaXNQcm90byA9IHR5cGVvZiBDdG9yID09ICdmdW5jdGlvbicgJiYgQ3Rvci5wcm90b3R5cGUgPT09IG9iamVjdCxcbiAgICAgIHJlc3VsdCA9IEFycmF5KGxlbmd0aCksXG4gICAgICBza2lwSW5kZXhlcyA9IGxlbmd0aCA+IDA7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICByZXN1bHRbaW5kZXhdID0gKGluZGV4ICsgJycpO1xuICB9XG4gIGZvciAodmFyIGtleSBpbiBvYmplY3QpIHtcbiAgICBpZiAoIShza2lwSW5kZXhlcyAmJiBpc0luZGV4KGtleSwgbGVuZ3RoKSkgJiZcbiAgICAgICAgIShrZXkgPT0gJ2NvbnN0cnVjdG9yJyAmJiAoaXNQcm90byB8fCAhaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIGtleSkpKSkge1xuICAgICAgcmVzdWx0LnB1c2goa2V5KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBrZXlzSW47XG4iLCJ2YXIgYmFzZVZhbHVlcyA9IHJlcXVpcmUoJy4uL2ludGVybmFsL2Jhc2VWYWx1ZXMnKSxcbiAgICBrZXlzID0gcmVxdWlyZSgnLi9rZXlzJyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiB0aGUgb3duIGVudW1lcmFibGUgcHJvcGVydHkgdmFsdWVzIG9mIGBvYmplY3RgLlxuICpcbiAqICoqTm90ZToqKiBOb24tb2JqZWN0IHZhbHVlcyBhcmUgY29lcmNlZCB0byBvYmplY3RzLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IHZhbHVlcy5cbiAqIEBleGFtcGxlXG4gKlxuICogZnVuY3Rpb24gRm9vKCkge1xuICogICB0aGlzLmEgPSAxO1xuICogICB0aGlzLmIgPSAyO1xuICogfVxuICpcbiAqIEZvby5wcm90b3R5cGUuYyA9IDM7XG4gKlxuICogXy52YWx1ZXMobmV3IEZvbyk7XG4gKiAvLyA9PiBbMSwgMl0gKGl0ZXJhdGlvbiBvcmRlciBpcyBub3QgZ3VhcmFudGVlZClcbiAqXG4gKiBfLnZhbHVlcygnaGknKTtcbiAqIC8vID0+IFsnaCcsICdpJ11cbiAqL1xuZnVuY3Rpb24gdmFsdWVzKG9iamVjdCkge1xuICByZXR1cm4gYmFzZVZhbHVlcyhvYmplY3QsIGtleXMob2JqZWN0KSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdmFsdWVzO1xuIiwidmFyIGJhc2VUb1N0cmluZyA9IHJlcXVpcmUoJy4uL2ludGVybmFsL2Jhc2VUb1N0cmluZycpO1xuXG4vKipcbiAqIFVzZWQgdG8gbWF0Y2ggYFJlZ0V4cGAgW3NwZWNpYWwgY2hhcmFjdGVyc10oaHR0cDovL3d3dy5yZWd1bGFyLWV4cHJlc3Npb25zLmluZm8vY2hhcmFjdGVycy5odG1sI3NwZWNpYWwpLlxuICogSW4gYWRkaXRpb24gdG8gc3BlY2lhbCBjaGFyYWN0ZXJzIHRoZSBmb3J3YXJkIHNsYXNoIGlzIGVzY2FwZWQgdG8gYWxsb3cgZm9yXG4gKiBlYXNpZXIgYGV2YWxgIHVzZSBhbmQgYEZ1bmN0aW9uYCBjb21waWxhdGlvbi5cbiAqL1xudmFyIHJlUmVnRXhwQ2hhcnMgPSAvWy4qKz9eJHt9KCl8W1xcXVxcL1xcXFxdL2csXG4gICAgcmVIYXNSZWdFeHBDaGFycyA9IFJlZ0V4cChyZVJlZ0V4cENoYXJzLnNvdXJjZSk7XG5cbi8qKlxuICogRXNjYXBlcyB0aGUgYFJlZ0V4cGAgc3BlY2lhbCBjaGFyYWN0ZXJzIFwiXFxcIiwgXCIvXCIsIFwiXlwiLCBcIiRcIiwgXCIuXCIsIFwifFwiLCBcIj9cIixcbiAqIFwiKlwiLCBcIitcIiwgXCIoXCIsIFwiKVwiLCBcIltcIiwgXCJdXCIsIFwie1wiIGFuZCBcIn1cIiBpbiBgc3RyaW5nYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IFN0cmluZ1xuICogQHBhcmFtIHtzdHJpbmd9IFtzdHJpbmc9JyddIFRoZSBzdHJpbmcgdG8gZXNjYXBlLlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgZXNjYXBlZCBzdHJpbmcuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uZXNjYXBlUmVnRXhwKCdbbG9kYXNoXShodHRwczovL2xvZGFzaC5jb20vKScpO1xuICogLy8gPT4gJ1xcW2xvZGFzaFxcXVxcKGh0dHBzOlxcL1xcL2xvZGFzaFxcLmNvbVxcL1xcKSdcbiAqL1xuZnVuY3Rpb24gZXNjYXBlUmVnRXhwKHN0cmluZykge1xuICBzdHJpbmcgPSBiYXNlVG9TdHJpbmcoc3RyaW5nKTtcbiAgcmV0dXJuIChzdHJpbmcgJiYgcmVIYXNSZWdFeHBDaGFycy50ZXN0KHN0cmluZykpXG4gICAgPyBzdHJpbmcucmVwbGFjZShyZVJlZ0V4cENoYXJzLCAnXFxcXCQmJylcbiAgICA6IHN0cmluZztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBlc2NhcGVSZWdFeHA7XG4iLCIvKiogVXNlZCBmb3IgbmF0aXZlIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IERPTSBzdXBwb3J0LiAqL1xudmFyIGRvY3VtZW50ID0gKGRvY3VtZW50ID0gZ2xvYmFsLndpbmRvdykgJiYgZG9jdW1lbnQuZG9jdW1lbnQ7XG5cbi8qKiBOYXRpdmUgbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgcHJvcGVydHlJc0VudW1lcmFibGUgPSBvYmplY3RQcm90by5wcm9wZXJ0eUlzRW51bWVyYWJsZTtcblxuLyoqXG4gKiBBbiBvYmplY3QgZW52aXJvbm1lbnQgZmVhdHVyZSBmbGFncy5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHR5cGUgT2JqZWN0XG4gKi9cbnZhciBzdXBwb3J0ID0ge307XG5cbihmdW5jdGlvbih4KSB7XG4gIHZhciBDdG9yID0gZnVuY3Rpb24oKSB7IHRoaXMueCA9IHg7IH0sXG4gICAgICBhcmdzID0gYXJndW1lbnRzLFxuICAgICAgb2JqZWN0ID0geyAnMCc6IHgsICdsZW5ndGgnOiB4IH0sXG4gICAgICBwcm9wcyA9IFtdO1xuXG4gIEN0b3IucHJvdG90eXBlID0geyAndmFsdWVPZic6IHgsICd5JzogeCB9O1xuICBmb3IgKHZhciBrZXkgaW4gbmV3IEN0b3IpIHsgcHJvcHMucHVzaChrZXkpOyB9XG5cbiAgLyoqXG4gICAqIERldGVjdCBpZiBmdW5jdGlvbnMgY2FuIGJlIGRlY29tcGlsZWQgYnkgYEZ1bmN0aW9uI3RvU3RyaW5nYFxuICAgKiAoYWxsIGJ1dCBGaXJlZm94IE9TIGNlcnRpZmllZCBhcHBzLCBvbGRlciBPcGVyYSBtb2JpbGUgYnJvd3NlcnMsIGFuZFxuICAgKiB0aGUgUGxheVN0YXRpb24gMzsgZm9yY2VkIGBmYWxzZWAgZm9yIFdpbmRvd3MgOCBhcHBzKS5cbiAgICpcbiAgICogQG1lbWJlck9mIF8uc3VwcG9ydFxuICAgKiBAdHlwZSBib29sZWFuXG4gICAqL1xuICBzdXBwb3J0LmZ1bmNEZWNvbXAgPSAvXFxidGhpc1xcYi8udGVzdChmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXM7IH0pO1xuXG4gIC8qKlxuICAgKiBEZXRlY3QgaWYgYEZ1bmN0aW9uI25hbWVgIGlzIHN1cHBvcnRlZCAoYWxsIGJ1dCBJRSkuXG4gICAqXG4gICAqIEBtZW1iZXJPZiBfLnN1cHBvcnRcbiAgICogQHR5cGUgYm9vbGVhblxuICAgKi9cbiAgc3VwcG9ydC5mdW5jTmFtZXMgPSB0eXBlb2YgRnVuY3Rpb24ubmFtZSA9PSAnc3RyaW5nJztcblxuICAvKipcbiAgICogRGV0ZWN0IGlmIHRoZSBET00gaXMgc3VwcG9ydGVkLlxuICAgKlxuICAgKiBAbWVtYmVyT2YgXy5zdXBwb3J0XG4gICAqIEB0eXBlIGJvb2xlYW5cbiAgICovXG4gIHRyeSB7XG4gICAgc3VwcG9ydC5kb20gPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCkubm9kZVR5cGUgPT09IDExO1xuICB9IGNhdGNoKGUpIHtcbiAgICBzdXBwb3J0LmRvbSA9IGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIERldGVjdCBpZiBgYXJndW1lbnRzYCBvYmplY3QgaW5kZXhlcyBhcmUgbm9uLWVudW1lcmFibGUuXG4gICAqXG4gICAqIEluIEZpcmVmb3ggPCA0LCBJRSA8IDksIFBoYW50b21KUywgYW5kIFNhZmFyaSA8IDUuMSBgYXJndW1lbnRzYCBvYmplY3RcbiAgICogaW5kZXhlcyBhcmUgbm9uLWVudW1lcmFibGUuIENocm9tZSA8IDI1IGFuZCBOb2RlLmpzIDwgMC4xMS4wIHRyZWF0XG4gICAqIGBhcmd1bWVudHNgIG9iamVjdCBpbmRleGVzIGFzIG5vbi1lbnVtZXJhYmxlIGFuZCBmYWlsIGBoYXNPd25Qcm9wZXJ0eWBcbiAgICogY2hlY2tzIGZvciBpbmRleGVzIHRoYXQgZXhjZWVkIHRoZSBudW1iZXIgb2YgZnVuY3Rpb24gcGFyYW1ldGVycyBhbmRcbiAgICogd2hvc2UgYXNzb2NpYXRlZCBhcmd1bWVudCB2YWx1ZXMgYXJlIGAwYC5cbiAgICpcbiAgICogQG1lbWJlck9mIF8uc3VwcG9ydFxuICAgKiBAdHlwZSBib29sZWFuXG4gICAqL1xuICB0cnkge1xuICAgIHN1cHBvcnQubm9uRW51bUFyZ3MgPSAhcHJvcGVydHlJc0VudW1lcmFibGUuY2FsbChhcmdzLCAxKTtcbiAgfSBjYXRjaChlKSB7XG4gICAgc3VwcG9ydC5ub25FbnVtQXJncyA9IHRydWU7XG4gIH1cbn0oMSwgMCkpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHN1cHBvcnQ7XG4iLCIvKipcbiAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgYHZhbHVlYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IFV0aWxpdHlcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHJldHVybiBmcm9tIHRoZSBuZXcgZnVuY3Rpb24uXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBmdW5jdGlvbi5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIG9iamVjdCA9IHsgJ3VzZXInOiAnZnJlZCcgfTtcbiAqIHZhciBnZXR0ZXIgPSBfLmNvbnN0YW50KG9iamVjdCk7XG4gKlxuICogZ2V0dGVyKCkgPT09IG9iamVjdDtcbiAqIC8vID0+IHRydWVcbiAqL1xuZnVuY3Rpb24gY29uc3RhbnQodmFsdWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjb25zdGFudDtcbiIsIi8qKlxuICogVGhpcyBtZXRob2QgcmV0dXJucyB0aGUgZmlyc3QgYXJndW1lbnQgcHJvdmlkZWQgdG8gaXQuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBVdGlsaXR5XG4gKiBAcGFyYW0geyp9IHZhbHVlIEFueSB2YWx1ZS5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIGB2YWx1ZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3QgPSB7ICd1c2VyJzogJ2ZyZWQnIH07XG4gKlxuICogXy5pZGVudGl0eShvYmplY3QpID09PSBvYmplY3Q7XG4gKiAvLyA9PiB0cnVlXG4gKi9cbmZ1bmN0aW9uIGlkZW50aXR5KHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpZGVudGl0eTtcbiIsInZhciBiYXNlUHJvcGVydHkgPSByZXF1aXJlKCcuLi9pbnRlcm5hbC9iYXNlUHJvcGVydHknKSxcbiAgICBiYXNlUHJvcGVydHlEZWVwID0gcmVxdWlyZSgnLi4vaW50ZXJuYWwvYmFzZVByb3BlcnR5RGVlcCcpLFxuICAgIGlzS2V5ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWwvaXNLZXknKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgZnVuY3Rpb24gd2hpY2ggcmV0dXJucyB0aGUgcHJvcGVydHkgdmFsdWUgYXQgYHBhdGhgIG9uIGFcbiAqIGdpdmVuIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IFV0aWxpdHlcbiAqIEBwYXJhbSB7QXJyYXl8c3RyaW5nfSBwYXRoIFRoZSBwYXRoIG9mIHRoZSBwcm9wZXJ0eSB0byBnZXQuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBmdW5jdGlvbi5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIG9iamVjdHMgPSBbXG4gKiAgIHsgJ2EnOiB7ICdiJzogeyAnYyc6IDIgfSB9IH0sXG4gKiAgIHsgJ2EnOiB7ICdiJzogeyAnYyc6IDEgfSB9IH1cbiAqIF07XG4gKlxuICogXy5tYXAob2JqZWN0cywgXy5wcm9wZXJ0eSgnYS5iLmMnKSk7XG4gKiAvLyA9PiBbMiwgMV1cbiAqXG4gKiBfLnBsdWNrKF8uc29ydEJ5KG9iamVjdHMsIF8ucHJvcGVydHkoWydhJywgJ2InLCAnYyddKSksICdhLmIuYycpO1xuICogLy8gPT4gWzEsIDJdXG4gKi9cbmZ1bmN0aW9uIHByb3BlcnR5KHBhdGgpIHtcbiAgcmV0dXJuIGlzS2V5KHBhdGgpID8gYmFzZVByb3BlcnR5KHBhdGgpIDogYmFzZVByb3BlcnR5RGVlcChwYXRoKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBwcm9wZXJ0eTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgc29ja2NlcHRpb25cblxuOyhmdW5jdGlvbihtb2R1bGUsIHJlcXVpcmUpe1xuICAgIHZhciB3cyA9IHJlcXVpcmUoXCJ3c1wiKVxuXG4gICAgc29ja2NlcHRpb24gPSBtb2R1bGUuZXhwb3J0c1xuXG4gICAgc29ja2NlcHRpb24uaW1wbCA9IHt9XG4gICAgdmFyIGltcGwgPSBzb2NrY2VwdGlvbi5pbXBsXG5cbiAgICBpbXBsLmlkR2VuID0gZnVuY3Rpb24ocHJlZml4KSB7XG4gICAgICAgIHZhciBjb3VudCA9IDBcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHByZWZpeCArIGNvdW50KytcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNvY2tjZXB0aW9uLmltcGwuaW5pdFJvdXRlID0gZnVuY3Rpb24ocm91dGVzLCByb3V0ZVBhdGgpIHtcbiAgICAgICAgdmFyIHJldCA9IHJvdXRlc1xuXG4gICAgICAgIHZhciBpID0gMFxuICAgICAgICB2YXIgbmV4dFxuXG4gICAgICAgIHdoaWxlIChpIDwgcm91dGVQYXRoLmxlbmd0aCkge1xuICAgICAgICAgICAgbmV4dCA9IHJldC5jaGlsZHJlbltyb3V0ZVBhdGhbaV1dXG4gICAgICAgICAgICBpZiAoIW5leHQpIHtcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0ID0gbmV4dFxuICAgICAgICAgICAgaSsrXG4gICAgICAgIH1cblxuICAgICAgICB3aGlsZSAoaSA8IHJvdXRlUGF0aC5sZW5ndGgpIHtcbiAgICAgICAgICAgIG5leHQgPSB7Y2hpbGRyZW46IHt9fVxuICAgICAgICAgICAgcmV0LmNoaWxkcmVuW3JvdXRlUGF0aFtpXV0gPSBuZXh0XG4gICAgICAgICAgICByZXQgPSBuZXh0XG4gICAgICAgICAgICBpKytcbiAgICAgICAgfVxuXG4gICAgICAgIHJldC52YWx1ZSA9IHJldC52YWx1ZSB8fCB7fVxuICAgICAgICByZXQgPSByZXQudmFsdWVcblxuICAgICAgICByZXR1cm4gcmV0XG4gICAgfVxuXG4gICAgc29ja2NlcHRpb24uaW1wbC5nZXRSb3V0ZSA9IGZ1bmN0aW9uKHJvdXRlcywgcm91dGVQYXRoKSB7XG4gICAgICAgIHZhciByZXQgPSByb3V0ZXNcblxuICAgICAgICB2YXIgaSA9IDBcbiAgICAgICAgdmFyIG5leHRcblxuICAgICAgICB3aGlsZSAoaSA8IHJvdXRlUGF0aC5sZW5ndGgpIHtcbiAgICAgICAgICAgIG5leHQgPSByZXQuY2hpbGRyZW5bcm91dGVQYXRoW2ldXVxuICAgICAgICAgICAgaWYgKCFuZXh0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0ID0gbmV4dFxuICAgICAgICAgICAgaSsrXG4gICAgICAgIH1cblxuICAgICAgICByZXQgPSByZXQudmFsdWVcblxuICAgICAgICByZXR1cm4gcmV0XG4gICAgfVxuXG4gICAgc29ja2NlcHRpb24uaW1wbC5sYXp5Q2FsbCA9IGZ1bmN0aW9uKGYpIHtcbiAgICAgICAgdmFyIHNldCA9IGZhbHNlXG4gICAgICAgIHZhciB2YWx1ZVxuICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAoc2V0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBmKClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNvY2tjZXB0aW9uLmZyb21QcmVmaXhBbmRUcmFuc3BvcnQgPSBmdW5jdGlvbihwcmVmaXgsIHRyYW5zcG9ydCwgbG9nKSB7XG4gICAgICAgIGxvZyA9IGxvZyB8fCB7fVxuICAgICAgICBsb2cuZGVidWcgPSBsb2cuZGVidWcgfHwgZnVuY3Rpb24oKSB7fVxuICAgICAgICBsb2cuaW5mbyA9IGxvZy5pbmZvIHx8IGZ1bmN0aW9uKCkge31cbiAgICAgICAgbG9nLmVycm9yID0gbG9nLmVycm9yIHx8IGZ1bmN0aW9uKCkge31cblxuICAgICAgICB2YXIgZmFjdG9yeSA9IHtcbiAgICAgICAgICAgIHJvdXRlczoge1xuICAgICAgICAgICAgICAgIGNoaWxkcmVuOiB7fVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGlkR2VuOiBpbXBsLmlkR2VuKHByZWZpeCksXG4gICAgICAgICAgICB0cmFuc3BvcnQ6IHRyYW5zcG9ydCxcbiAgICAgICAgICAgIGNsb3NlSGFuZGxlcnM6IFtdLFxuICAgICAgICAgICAgY3JlYXRlOiBmdW5jdGlvbihyb3V0ZVBhdGgsIHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdmFyIHNvY2tldCA9IHtcbiAgICAgICAgICAgICAgICAgICAgaW1wbDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgZmFjdG9yeTogZmFjdG9yeSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvdXRlUGF0aDogcm91dGVQYXRoLFxuICAgICAgICAgICAgICAgICAgICAgICAgcm91dGU6IHNvY2tjZXB0aW9uLmltcGwubGF6eUNhbGwoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNvY2tjZXB0aW9uLmltcGwuaW5pdFJvdXRlKGZhY3Rvcnkucm91dGVzLCByb3V0ZVBhdGgpXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgICAgICAgICAgICAgIHNlbmQ6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaW1wbCA9IHNvY2tldC5pbXBsXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZmFjdG9yeSA9IGltcGwuZmFjdG9yeVxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHN1YnNvY2tldCA9IGZhY3RvcnkuY3JlYXRlKFtmYWN0b3J5LmlkR2VuKCldLCBudWxsKVxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHNlbmRPYmogPSBbaW1wbC5yb3V0ZVBhdGgsIHN1YnNvY2tldC5pbXBsLnJvdXRlUGF0aCwgdmFsdWVdXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgc2VuZFN0ciA9IEpTT04uc3RyaW5naWZ5KHNlbmRPYmopXG4gICAgICAgICAgICAgICAgICAgICAgICBsb2cuZGVidWcoXCJTZW5kaW5nOiBcIiArIHNlbmRTdHIpXG4gICAgICAgICAgICAgICAgICAgICAgICBmYWN0b3J5LnRyYW5zcG9ydC5zZW5kKHNlbmRTdHIpXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzdWJzb2NrZXRcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgcmVjZWl2ZU9uZTogZnVuY3Rpb24oY2IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNvY2tldC5pbXBsLnJvdXRlKCkuaGFuZGxlciA9IGZ1bmN0aW9uKHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYihzKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBzb2NrZXQuaW1wbC5yb3V0ZSgpLmhhbmRsZXIgLy8gVE9ETzogZGVsZXRlIHNvY2tldC5pbXBsLnJvdXRlKCkgdG9vXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHJlY2VpdmVNYW55OiBmdW5jdGlvbihjYikge1xuICAgICAgICAgICAgICAgICAgICAgICAgc29ja2V0LmltcGwucm91dGUoKS5oYW5kbGVyID0gZnVuY3Rpb24ocykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNiKHMsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgc29ja2V0LmltcGwucm91dGUoKS5oYW5kbGVyIC8vIFRPRE86IGRlbGV0ZSBzb2NrZXQuaW1wbC5yb3V0ZSgpIHRvb1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHJvdXRlOiBmdW5jdGlvbihyb3V0ZUl0ZW0pIHsgLy8gVE9ETzogc2hvdWxkIHRoaXMgYmUgbWFraW5nIGR1cGxpY2F0ZXMgb2Ygcm91dGVzIGxpa2UgdGhpcz8gc2hvdWxkIHdvcmsgZmluZS4uLlxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGltcGwgPSBzb2NrZXQuaW1wbFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG5ld1JvdXRlUGF0aCA9IGltcGwucm91dGVQYXRoLnNsaWNlKClcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld1JvdXRlUGF0aC5wdXNoKHJvdXRlSXRlbSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBpbXBsLmZhY3RvcnkuY3JlYXRlKG5ld1JvdXRlUGF0aCwgbnVsbClcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgbXVsdGlSb3V0ZTogZnVuY3Rpb24ocm91dGVSZWNlaXZlcnMpIHsgLy8gVE9ETzogdGVzdCwgbXVsdGlSb3V0ZU9uZT9cbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIHJvdXRlSXRlbSBpbiByb3V0ZVJlY2VpdmVycykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNvY2tldC5yb3V0ZShyb3V0ZUl0ZW0pLnJlY2VpdmVNYW55KHJvdXRlUmVjZWl2ZXJzW3JvdXRlSXRlbV0pXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIG9uY2xvc2U6IGZ1bmN0aW9uKGNiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzb2NrZXQuaW1wbC5mYWN0b3J5LmNsb3NlSGFuZGxlcnMucHVzaChjYilcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiBzb2NrZXRcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRyYW5zcG9ydC5yZWNlaXZlKGZ1bmN0aW9uKHN0cikge1xuICAgICAgICAgICAgbG9nLmRlYnVnKFwiUmVjZWl2ZWQ6IFwiICsgc3RyKVxuICAgICAgICAgICAgdmFyIHBhcnNlZCA9IEpTT04ucGFyc2Uoc3RyKVxuXG4gICAgICAgICAgICB2YXIgcm91dGUgPSBzb2NrY2VwdGlvbi5pbXBsLmdldFJvdXRlKGZhY3Rvcnkucm91dGVzLCBwYXJzZWRbMF0pXG5cbiAgICAgICAgICAgIGlmICghcm91dGUpIHtcbiAgICAgICAgICAgICAgICBsb2cuZXJyb3IoXCJSb3V0ZSBub3Qgc2V0OiBcIiArIEpTT04uc3RyaW5naWZ5KHBhcnNlZFswXSkpIC8vIFRPRE86IGluZm9ybSBvdGhlciBlbmQ/XG4gICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghcm91dGUgfHwgIXJvdXRlLmhhbmRsZXIpIHtcbiAgICAgICAgICAgICAgICBsb2cuZXJyb3IoXCJSb3V0ZSBidXQgbm8gaGFuZGxlciBmb3I6IFwiICsgSlNPTi5zdHJpbmdpZnkocGFyc2VkWzBdKSkgLy8gVE9ETzogaW5mb3JtIG90aGVyIGVuZD9cbiAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcm91dGUuaGFuZGxlcihmYWN0b3J5LmNyZWF0ZShwYXJzZWRbMV0sIHBhcnNlZFsyXSkpXG4gICAgICAgIH0pXG5cbiAgICAgICAgdmFyIGZpcnN0U29jayA9IGZhY3RvcnkuY3JlYXRlKFtcIjBcIl0sIG51bGwpXG5cbiAgICAgICAgdmFyIGNsb3NlZCA9IGZhbHNlXG5cbiAgICAgICAgZmlyc3RTb2NrLmNsb3NlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAoIWNsb3NlZCkge1xuICAgICAgICAgICAgICAgIHRyYW5zcG9ydC5jbG9zZSgpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0cmFuc3BvcnQub25jbG9zZShmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNsb3NlZCA9IHRydWVcbiAgICAgICAgICAgIGZhY3RvcnkuY2xvc2VIYW5kbGVycy5mb3JFYWNoKGZ1bmN0aW9uKGhhbmRsZXIpIHtcbiAgICAgICAgICAgICAgICBoYW5kbGVyKClcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pXG5cbiAgICAgICAgcmV0dXJuIGZpcnN0U29ja1xuICAgIH1cblxuICAgIGltcGwudHJhbnNwb3J0UGFpciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgdHJhbnNwb3J0cyA9IHtcbiAgICAgICAgICAgIGE6IHtcbiAgICAgICAgICAgICAgICBpbXBsOiB7XG4gICAgICAgICAgICAgICAgICAgIGhhbmRsZXI6IGZ1bmN0aW9uKCkge30sXG4gICAgICAgICAgICAgICAgICAgIGNsb3NlSGFuZGxlcjogZnVuY3Rpb24oKSB7fVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgc2VuZDogZnVuY3Rpb24obXNnKSB7XG4gICAgICAgICAgICAgICAgICAgIHByb2Nlc3MubmV4dFRpY2soZnVuY3Rpb24oKSB7IC8vIFRPRE86IGJyb3dzZXIgY29tcGF0aWJpbGl0eVxuICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNwb3J0cy5iLmltcGwuaGFuZGxlcihtc2cpXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBjbG9zZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHByb2Nlc3MubmV4dFRpY2soZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0cmFuc3BvcnRzLmEuaW1wbC5jbG9zZUhhbmRsZXIoKVxuICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNwb3J0cy5iLmltcGwuY2xvc2VIYW5kbGVyKClcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHJlY2VpdmU6IGZ1bmN0aW9uKGhhbmRsZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNwb3J0cy5hLmltcGwuaGFuZGxlciA9IGhhbmRsZXJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIG9uY2xvc2U6IGZ1bmN0aW9uKGhhbmRsZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNwb3J0cy5hLmltcGwuY2xvc2VIYW5kbGVyID0gaGFuZGxlclxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBiOiB7XG4gICAgICAgICAgICAgICAgaW1wbDoge1xuICAgICAgICAgICAgICAgICAgICBoYW5kbGVyOiBmdW5jdGlvbigpIHt9LFxuICAgICAgICAgICAgICAgICAgICBjbG9zZUhhbmRsZXI6IGZ1bmN0aW9uKCkge31cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHNlbmQ6IGZ1bmN0aW9uKG1zZykge1xuICAgICAgICAgICAgICAgICAgICBwcm9jZXNzLm5leHRUaWNrKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNwb3J0cy5hLmltcGwuaGFuZGxlcihtc2cpXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBjbG9zZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHByb2Nlc3MubmV4dFRpY2soZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0cmFuc3BvcnRzLmIuaW1wbC5jbG9zZUhhbmRsZXIoKVxuICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNwb3J0cy5hLmltcGwuY2xvc2VIYW5kbGVyKClcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHJlY2VpdmU6IGZ1bmN0aW9uKGhhbmRsZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNwb3J0cy5iLmltcGwuaGFuZGxlciA9IGhhbmRsZXJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIG9uY2xvc2U6IGZ1bmN0aW9uKGhhbmRsZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNwb3J0cy5iLmltcGwuY2xvc2VIYW5kbGVyID0gaGFuZGxlclxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0cmFuc3BvcnRzXG4gICAgfVxuXG4gICAgc29ja2NlcHRpb24ucGFpciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgcGFpciA9IGltcGwudHJhbnNwb3J0UGFpcigpXG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGE6IHNvY2tjZXB0aW9uLmZyb21QcmVmaXhBbmRUcmFuc3BvcnQoXCJhXCIsIHBhaXIuYSksXG4gICAgICAgICAgICBiOiBzb2NrY2VwdGlvbi5mcm9tUHJlZml4QW5kVHJhbnNwb3J0KFwiYlwiLCBwYWlyLmIpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzb2NrY2VwdGlvbi5saXN0ZW4gPSBmdW5jdGlvbihvcHQpIHtcbiAgICAgICAgaWYgKCF3cykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiV2Vic29ja2V0IHNlcnZlciBub3Qgc3VwcG9ydGVkIGluIHRoaXMgZW52aXJvbm1lbnRcIilcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciB3c3MgPSBuZXcgd3MuU2VydmVyKHtwb3J0OiBvcHQucG9ydH0pXG5cbiAgICAgICAgdmFyIHNvY2tIYW5kbGVyID0gZnVuY3Rpb24oKSB7fVxuXG4gICAgICAgIHdzcy5vbihcImNvbm5lY3Rpb25cIiwgZnVuY3Rpb24od2Vic29jaykge1xuICAgICAgICAgICAgdmFyIGhhbmRsZXIgPSBmdW5jdGlvbigpIHt9IC8vIFRPRE86IHRpbWVvdXQgcXVldWVzP1xuXG4gICAgICAgICAgICB3ZWJzb2NrLm9uKFwibWVzc2FnZVwiLCBmdW5jdGlvbihtc2cpIHtcbiAgICAgICAgICAgICAgICBoYW5kbGVyKG1zZy50b1N0cmluZygpKVxuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgc29ja0hhbmRsZXIoc29ja2NlcHRpb24uZnJvbVByZWZpeEFuZFRyYW5zcG9ydChcbiAgICAgICAgICAgICAgICBcInNcIixcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHNlbmQ6IGZ1bmN0aW9uKHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdlYnNvY2suc2VuZChzLCBmdW5jdGlvbihlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlcnJvciAmJiBvcHQubG9nICYmIG9wdC5sb2cuZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0LmxvZy5lcnJvcihcIndzOiBcIiArIGVycm9yKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGNsb3NlOiBmdW5jdGlvbigpIHsgd2Vic29jay5jbG9zZSgpIH0sIC8vIFRPRE86IHRlc3RcbiAgICAgICAgICAgICAgICAgICAgcmVjZWl2ZTogZnVuY3Rpb24oY2IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdlYnNvY2sub25tZXNzYWdlID0gZnVuY3Rpb24obXNnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2IobXNnLmRhdGEudG9TdHJpbmcoKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgb25jbG9zZTogZnVuY3Rpb24oY2IpIHsgd2Vic29jay5vbmNsb3NlID0gY2IgfSAvLyBUT0RPOiB0ZXN0XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBvcHQubG9nKSlcbiAgICAgICAgfSlcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVjZWl2ZU1hbnk6IGZ1bmN0aW9uKGhhbmRsZXIpIHtcbiAgICAgICAgICAgICAgICBzb2NrSGFuZGxlciA9IGhhbmRsZXJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjbG9zZTogZnVuY3Rpb24oKSB7IHdzcy5jbG9zZSgpIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGltcGwuY2xpZW50V2Vic29ja2V0VHJhbnNwb3J0ID0gKFxuICAgICAgICB3cyA/XG4gICAgICAgIGZ1bmN0aW9uKGFkZHIsIGxvZykge1xuICAgICAgICAgICAgdmFyIHNvY2sgPSBuZXcgd3MoYWRkcilcblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzZW5kOiBmdW5jdGlvbihtc2cpIHtcbiAgICAgICAgICAgICAgICAgICAgc29jay5zZW5kKG1zZywgZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvZy5lcnJvcihcIndzOiBcIiArIGVycm9yKVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgY2xvc2U6IGZ1bmN0aW9uKCkgeyBzb2NrLmNsb3NlKCkgfSxcbiAgICAgICAgICAgICAgICByZWNlaXZlOiBmdW5jdGlvbihjYikgeyBzb2NrLm9ubWVzc2FnZSA9IGZ1bmN0aW9uKG1zZykge1xuICAgICAgICAgICAgICAgICAgICBjYihtc2cuZGF0YS50b1N0cmluZygpKVxuICAgICAgICAgICAgICAgIH19LFxuICAgICAgICAgICAgICAgIG9uY2xvc2U6IGZ1bmN0aW9uKGNiKSB7IHNvY2sub25jbG9zZSA9IGNiIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSA6XG4gICAgICAgIGZ1bmN0aW9uKGFkZHIpIHtcbiAgICAgICAgICAgIHZhciBzb2NrID0gbmV3IFdlYlNvY2tldChhZGRyKVxuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHNlbmQ6IGZ1bmN0aW9uKG1zZykgeyBzb2NrLnNlbmQobXNnKSB9LFxuICAgICAgICAgICAgICAgIGNsb3NlOiBmdW5jdGlvbigpIHsgc29jay5jbG9zZSgpIH0sXG4gICAgICAgICAgICAgICAgcmVjZWl2ZTogZnVuY3Rpb24oY2IpIHsgc29jay5vbm1lc3NhZ2UgPSBmdW5jdGlvbihtc2cpIHsgY2IobXNnLmRhdGEudG9TdHJpbmcoKSkgfSB9LFxuICAgICAgICAgICAgICAgIG9uY2xvc2U6IGZ1bmN0aW9uKGNiKSB7IHNvY2sub25jbG9zZSA9IGNiIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIClcblxuICAgIHNvY2tjZXB0aW9uLmNvbm5lY3QgPSBmdW5jdGlvbihhZGRyZXNzLCBsb2cpIHtcbiAgICAgICAgcmV0dXJuIHNvY2tjZXB0aW9uLmZyb21QcmVmaXhBbmRUcmFuc3BvcnQoXCJjXCIsIGltcGwuY2xpZW50V2Vic29ja2V0VHJhbnNwb3J0KGFkZHJlc3MsIGxvZyksIGxvZylcbiAgICB9XG5cbiAgICBzb2NrY2VwdGlvbi51dGlsID0gcmVxdWlyZShcIi4vdXRpbFwiKVxufSkoXG4gICAgdHlwZW9mIG1vZHVsZSA9PT0gXCJ1bmRlZmluZWRcIiA/IHtleHBvcnRzOiB7fX0gOiBtb2R1bGUsXG4gICAgdHlwZW9mIHJlcXVpcmUgPT09IFwidW5kZWZpbmVkXCIgPyBmdW5jdGlvbigpIHt9IDogcmVxdWlyZVxuKSIsIlwidXNlIHN0cmljdFwiO1xuXG47KGZ1bmN0aW9uKG1vZHVsZSkge1xuICAgIHZhciB1dGlsID0gbW9kdWxlLmV4cG9ydHNcbiAgICB2YXIgc2MgPSAodGhpcy5zb2NrY2VwdGlvbiA9PT0gdW5kZWZpbmVkID8ge30gOiB0aGlzLnNvY2tjZXB0aW9uKVxuICAgIHNjLnV0aWwgPSB1dGlsXG5cbiAgICAvLyBERVBSRUNBVEVEXG4gICAgdXRpbC5yb3V0ZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHJvdXRlciA9IGZ1bmN0aW9uKHMpIHtcbiAgICAgICAgICAgIHZhciByb3V0ZSA9IHJvdXRlci5pbXBsLnRyYW5zZm9ybShzLnZhbHVlKVxuICAgICAgICAgICAgdmFyIGhhbmRsZXIgPSByb3V0ZXIuaW1wbC5yb3V0ZXNbcm91dGVdIHx8IHJvdXRlci5pbXBsLmRlZmF1bHRcbiAgICAgICAgICAgIGhhbmRsZXIocylcbiAgICAgICAgfVxuXG4gICAgICAgIHJvdXRlci5pbXBsID0ge1xuICAgICAgICAgICAgdHJhbnNmb3JtOiBmdW5jdGlvbih2YWx1ZSkgeyByZXR1cm4gdmFsdWUgfSxcbiAgICAgICAgICAgIHJvdXRlczoge30sXG4gICAgICAgICAgICBkZWZhdWx0OiBmdW5jdGlvbigpIHt9XG4gICAgICAgIH1cblxuICAgICAgICByb3V0ZXIudHJhbnNmb3JtID0gZnVuY3Rpb24odHJhbnNmb3JtKSB7XG4gICAgICAgICAgICByb3V0ZXIuaW1wbC50cmFuc2Zvcm0gPSB0cmFuc2Zvcm1cbiAgICAgICAgICAgIHJldHVybiByb3V0ZXJcbiAgICAgICAgfVxuXG4gICAgICAgIHJvdXRlci5yb3V0ZSA9IGZ1bmN0aW9uKHJvdXRlLCBoYW5kbGVyKSB7XG4gICAgICAgICAgICByb3V0ZXIuaW1wbC5yb3V0ZXNbcm91dGVdID0gaGFuZGxlclxuICAgICAgICAgICAgcmV0dXJuIHJvdXRlclxuICAgICAgICB9XG5cbiAgICAgICAgcm91dGVyLnVucm91dGUgPSBmdW5jdGlvbihyb3V0ZSkge1xuICAgICAgICAgICAgZGVsZXRlIHJvdXRlci5pbXBsLnJvdXRlc1tyb3V0ZV1cbiAgICAgICAgICAgIHJldHVybiByb3V0ZXJcbiAgICAgICAgfVxuXG4gICAgICAgIHJvdXRlci51bnJvdXRlQWxsID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByb3V0ZXIuaW1wbC5yb3V0ZXMgPSB7fVxuICAgICAgICAgICAgcmV0dXJuIHJvdXRlclxuICAgICAgICB9XG5cbiAgICAgICAgcm91dGVyLmRlZmF1bHQgPSBmdW5jdGlvbihoYW5kbGVyKSB7XG4gICAgICAgICAgICByb3V0ZXIuaW1wbC5kZWZhdWx0ID0gaGFuZGxlclxuICAgICAgICAgICAgcmV0dXJuIHJvdXRlclxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJvdXRlclxuICAgIH1cblxuICAgIHV0aWwuY2hhaW4gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGNoYWluID0gZnVuY3Rpb24ocykge1xuICAgICAgICAgICAgY2hhaW4uaW1wbC5oYW5kbGVycy5mb3JFYWNoKGZ1bmN0aW9uKGhhbmRsZXIpIHtcbiAgICAgICAgICAgICAgICBoYW5kbGVyKHMpXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG5cbiAgICAgICAgY2hhaW4uaW1wbCA9IHtcbiAgICAgICAgICAgIGhhbmRsZXJzOiBbXVxuICAgICAgICB9XG5cbiAgICAgICAgY2hhaW4ucHVzaCA9IGZ1bmN0aW9uKGhhbmRsZXIpIHtcbiAgICAgICAgICAgIGNoYWluLmltcGwuaGFuZGxlcnMucHVzaChoYW5kbGVyKVxuICAgICAgICAgICAgcmV0dXJuIGNoYWluXG4gICAgICAgIH1cblxuICAgICAgICBjaGFpbi5wb3AgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNoYWluLmltcGwuaGFuZGxlcnMucG9wKClcbiAgICAgICAgICAgIHJldHVybiBjaGFpblxuICAgICAgICB9XG5cbiAgICAgICAgY2hhaW4uc2hpZnQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNoYWluLmltcGwuaGFuZGxlcnMuc2hpZnQoKVxuICAgICAgICAgICAgcmV0dXJuIGNoYWluXG4gICAgICAgIH1cblxuICAgICAgICBjaGFpbi51bnNoaWZ0ID0gZnVuY3Rpb24oaGFuZGxlcikge1xuICAgICAgICAgICAgY2hhaW4uaW1wbC5oYW5kbGVycy51bnNoaWZ0KGhhbmRsZXIpXG4gICAgICAgICAgICByZXR1cm4gY2hhaW5cbiAgICAgICAgfVxuXG4gICAgICAgIGNoYWluLmNsZWFyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjaGFpbi5pbXBsLmhhbmRsZXJzLmxlbmd0aCA9IDBcbiAgICAgICAgICAgIHJldHVybiBjaGFpblxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGNoYWluXG4gICAgfVxuXG4gICAgdXRpbC5hY2tlciA9IGZ1bmN0aW9uKHMpIHsgcy5zZW5kKFwiYWNrXCIpIH1cbiAgICB1dGlsLmVjaG8gPSBmdW5jdGlvbihzKSB7IHMuc2VuZChzLnZhbHVlKSB9XG5cbiAgICAvLyBERVBSRUNBVEVEXG4gICAgdXRpbC5vbmNlID0gZnVuY3Rpb24oZikge1xuICAgICAgICB2YXIgY2FsbGVkID0gZmFsc2VcblxuICAgICAgICByZXR1cm4gZnVuY3Rpb24ocykge1xuICAgICAgICAgICAgaWYgKGNhbGxlZCkge1xuICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjYWxsZWQgPSB0cnVlXG4gICAgICAgICAgICByZXR1cm4gZihzKVxuICAgICAgICB9XG4gICAgfVxufSkuY2FsbCh0aGlzLCB0eXBlb2YgbW9kdWxlID09PSBcInVuZGVmaW5lZFwiID8ge2V4cG9ydHM6IHt9fSA6IG1vZHVsZSkiLCJcbi8qKlxuICogTW9kdWxlIGRlcGVuZGVuY2llcy5cbiAqL1xuXG52YXIgZ2xvYmFsID0gKGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpczsgfSkoKTtcblxuLyoqXG4gKiBXZWJTb2NrZXQgY29uc3RydWN0b3IuXG4gKi9cblxudmFyIFdlYlNvY2tldCA9IGdsb2JhbC5XZWJTb2NrZXQgfHwgZ2xvYmFsLk1veldlYlNvY2tldDtcblxuLyoqXG4gKiBNb2R1bGUgZXhwb3J0cy5cbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IFdlYlNvY2tldCA/IHdzIDogbnVsbDtcblxuLyoqXG4gKiBXZWJTb2NrZXQgY29uc3RydWN0b3IuXG4gKlxuICogVGhlIHRoaXJkIGBvcHRzYCBvcHRpb25zIG9iamVjdCBnZXRzIGlnbm9yZWQgaW4gd2ViIGJyb3dzZXJzLCBzaW5jZSBpdCdzXG4gKiBub24tc3RhbmRhcmQsIGFuZCB0aHJvd3MgYSBUeXBlRXJyb3IgaWYgcGFzc2VkIHRvIHRoZSBjb25zdHJ1Y3Rvci5cbiAqIFNlZTogaHR0cHM6Ly9naXRodWIuY29tL2VpbmFyb3Mvd3MvaXNzdWVzLzIyN1xuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB1cmlcbiAqIEBwYXJhbSB7QXJyYXl9IHByb3RvY29scyAob3B0aW9uYWwpXG4gKiBAcGFyYW0ge09iamVjdCkgb3B0cyAob3B0aW9uYWwpXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIHdzKHVyaSwgcHJvdG9jb2xzLCBvcHRzKSB7XG4gIHZhciBpbnN0YW5jZTtcbiAgaWYgKHByb3RvY29scykge1xuICAgIGluc3RhbmNlID0gbmV3IFdlYlNvY2tldCh1cmksIHByb3RvY29scyk7XG4gIH0gZWxzZSB7XG4gICAgaW5zdGFuY2UgPSBuZXcgV2ViU29ja2V0KHVyaSk7XG4gIH1cbiAgcmV0dXJuIGluc3RhbmNlO1xufVxuXG5pZiAoV2ViU29ja2V0KSB3cy5wcm90b3R5cGUgPSBXZWJTb2NrZXQucHJvdG90eXBlO1xuIiwiJ3VzZSBzdHJpY3QnXG5cbmxldCBjcmVhdGVCbG9jayA9ICh4LCB5LCB3LCBoLCBjc3NDbGFzcykgPT4ge1xuICAgIGxldCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgXG4gICAgZWwuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnXG5cbiAgICBlbC5zdHlsZS5sZWZ0ID0geCArICdweCdcbiAgICBlbC5zdHlsZS50b3AgPSB5ICsgJ3B4J1xuICAgIGVsLnN0eWxlLndpZHRoID0gdyArICdweCdcbiAgICBlbC5zdHlsZS5oZWlnaHQgPSBoICsgJ3B4J1xuXG4gICAgZWwuc2V0QXR0cmlidXRlKCdjbGFzcycsIGNzc0NsYXNzKVxuXG4gICAgcmV0dXJuIGVsXG59XG5cbmV4cG9ydCBkZWZhdWx0IChteikgPT4ge1xuICAgIGxldCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgZWwuc2V0QXR0cmlidXRlKCdjbGFzcycsICdtYXplJylcblxuICAgIGxldCBlZGdlVW5pdHMgPSAwLjFcblxuICAgIGxldCBtekRpc3BsYXlXaWR0aFVuaXRzID0gbXouc2l6ZS5jb2xzICsgZWRnZVVuaXRzICogKG16LnNpemUuY29scyArIDEpXG4gICAgbGV0IG16RGlzcGxheUhlaWdodFVuaXRzID0gbXouc2l6ZS5yb3dzICsgZWRnZVVuaXRzICogKG16LnNpemUucm93cyArIDEpXG5cbiAgICBsZXQgdW5pdFNpemUgPSAwLjkgKiBNYXRoLm1pbihcbiAgICAgICAgd2luZG93LmlubmVyV2lkdGggLyBtekRpc3BsYXlXaWR0aFVuaXRzLFxuICAgICAgICB3aW5kb3cuaW5uZXJIZWlnaHQgLyBtekRpc3BsYXlIZWlnaHRVbml0c1xuICAgIClcblxuICAgIGxldCB4U3RhcnQgPSAwLjUgKiAod2luZG93LmlubmVyV2lkdGggLSB1bml0U2l6ZSAqIG16RGlzcGxheVdpZHRoVW5pdHMpXG4gICAgbGV0IHlTdGFydCA9IDAuNSAqICh3aW5kb3cuaW5uZXJIZWlnaHQgLSB1bml0U2l6ZSAqIG16RGlzcGxheUhlaWdodFVuaXRzKVxuXG4gICAgLy8gY29ybmVyc1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDw9IG16LnNpemUucm93czsgKytpKSB7XG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDw9IG16LnNpemUuY29sczsgKytqKSB7XG4gICAgICAgICAgICBlbC5hcHBlbmRDaGlsZChjcmVhdGVCbG9jayhcbiAgICAgICAgICAgICAgICB4U3RhcnQgKyBqICogdW5pdFNpemUgKiAoMSArIGVkZ2VVbml0cyksXG4gICAgICAgICAgICAgICAgeVN0YXJ0ICsgaSAqIHVuaXRTaXplICogKDEgKyBlZGdlVW5pdHMpLFxuICAgICAgICAgICAgICAgIHVuaXRTaXplICogZWRnZVVuaXRzLFxuICAgICAgICAgICAgICAgIHVuaXRTaXplICogZWRnZVVuaXRzLFxuICAgICAgICAgICAgICAgICdjb3JuZXInXG4gICAgICAgICAgICApKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gaG9yaXpvbnRhbCBlZGdlc1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDw9IG16LnNpemUucm93czsgKytpKSB7XG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgbXouc2l6ZS5jb2xzOyArK2opIHtcbiAgICAgICAgICAgIGVsLmFwcGVuZENoaWxkKGNyZWF0ZUJsb2NrKFxuICAgICAgICAgICAgICAgIHhTdGFydCArIHVuaXRTaXplICogKGVkZ2VVbml0cyArIGogKiAoMSArIGVkZ2VVbml0cykpLFxuICAgICAgICAgICAgICAgIHlTdGFydCArIHVuaXRTaXplICogaSAqICgxICsgZWRnZVVuaXRzKSxcbiAgICAgICAgICAgICAgICB1bml0U2l6ZSAqIDEsXG4gICAgICAgICAgICAgICAgdW5pdFNpemUgKiBlZGdlVW5pdHMsXG4gICAgICAgICAgICAgICAgJ3dhbGwnICsgKG16LmVkZ2VzLmhvcml6b250YWxbaV1bal0gPyAnJyA6ICcgZW5hYmxlZCcpXG4gICAgICAgICAgICApKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gdmVydGljYWwgZWRnZXNcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG16LnNpemUucm93czsgKytpKSB7XG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDw9IG16LnNpemUuY29sczsgKytqKSB7XG4gICAgICAgICAgICBlbC5hcHBlbmRDaGlsZChjcmVhdGVCbG9jayhcbiAgICAgICAgICAgICAgICB4U3RhcnQgKyB1bml0U2l6ZSAqIGogKiAoMSArIGVkZ2VVbml0cyksXG4gICAgICAgICAgICAgICAgeVN0YXJ0ICsgdW5pdFNpemUgKiAoZWRnZVVuaXRzICsgaSAqICgxICsgZWRnZVVuaXRzKSksXG4gICAgICAgICAgICAgICAgdW5pdFNpemUgKiBlZGdlVW5pdHMsXG4gICAgICAgICAgICAgICAgdW5pdFNpemUgKiAxLFxuICAgICAgICAgICAgICAgICd3YWxsJyArIChtei5lZGdlcy52ZXJ0aWNhbFtpXVtqXSA/ICcnIDogJyBlbmFibGVkJylcbiAgICAgICAgICAgICkpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBjZWxsc1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbXouc2l6ZS5yb3dzOyArK2kpIHtcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBtei5zaXplLmNvbHM7ICsraikge1xuICAgICAgICAgICAgZWwuYXBwZW5kQ2hpbGQoY3JlYXRlQmxvY2soXG4gICAgICAgICAgICAgICAgeFN0YXJ0ICsgdW5pdFNpemUgKiAoZWRnZVVuaXRzICsgaiAqICgxICsgZWRnZVVuaXRzKSksXG4gICAgICAgICAgICAgICAgeVN0YXJ0ICsgdW5pdFNpemUgKiAoZWRnZVVuaXRzICsgaSAqICgxICsgZWRnZVVuaXRzKSksXG4gICAgICAgICAgICAgICAgdW5pdFNpemUgKiAxLFxuICAgICAgICAgICAgICAgIHVuaXRTaXplICogMSxcbiAgICAgICAgICAgICAgICAnY2VsbCdcbiAgICAgICAgICAgICkpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBlbGVtZW50OiBlbCxcbiAgICAgICAgZ2V0UG9zKGksIGopIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgeDogeFN0YXJ0ICsgdW5pdFNpemUgKiAoZWRnZVVuaXRzICsgMC41ICsgaiAqICgxICsgZWRnZVVuaXRzKSksXG4gICAgICAgICAgICAgICAgeTogeVN0YXJ0ICsgdW5pdFNpemUgKiAoZWRnZVVuaXRzICsgMC41ICsgaSAqICgxICsgZWRnZVVuaXRzKSksXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCIndXNlIHN0cmljdCdcblxuaW1wb3J0IG1hemUgZnJvbSAnLi9tYXplJ1xuaW1wb3J0IGNyZWF0ZU1hemVEaXNwbGF5IGZyb20gJy4vY3JlYXRlTWF6ZURpc3BsYXknXG5pbXBvcnQgbW91c2UgZnJvbSAnLi9tb3VzZSdcbmltcG9ydCBzb2NrY2VwdGlvbiBmcm9tICdzb2NrY2VwdGlvbidcblxubGV0IHN0YXJ0TmV3R2FtZSA9IChlZGdlcywgcG9zLCBvblVwZGF0ZSkgPT4ge1xuICAgIC8vIENsZWFyIGN1cnJlbnQgZG9jdW1lbnRcbiAgICB3aGlsZSAoZG9jdW1lbnQuYm9keS5maXJzdENoaWxkKSB7XG4gICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoZG9jdW1lbnQuYm9keS5maXJzdENoaWxkKVxuICAgIH1cblxuICAgIGxldCBteiA9IG1hemUuZ3JpZChlZGdlcylcbiAgICBsZXQgbWF6ZURpc3BsYXkgPSBjcmVhdGVNYXplRGlzcGxheShteilcblxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoXG4gICAgICAgIG1hemVEaXNwbGF5LmVsZW1lbnRcbiAgICApXG5cbiAgICBsZXQgbW91c2VDZWxsUG9zID0gbWF6ZURpc3BsYXkuZ2V0UG9zKHBvcy5yb3csIHBvcy5jb2wpXG5cbiAgICBsZXQgY2hlZXNlQ2VsbFBvcyA9IG1hemVEaXNwbGF5LmdldFBvcyhtei5zaXplLnJvd3MgLSAxLCBtei5zaXplLmNvbHMgLSAxKVxuICAgIGxldCBjaGVlc2VFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJylcbiAgICBjaGVlc2VFbGVtZW50LnNyYyA9ICdhc3NldHMvY2hlZXNlLmdpZidcbiAgICBjaGVlc2VFbGVtZW50LnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJ1xuICAgIGNoZWVzZUVsZW1lbnQuc3R5bGUubGVmdCA9IGNoZWVzZUNlbGxQb3MueCAtIDE2ICsgJ3B4J1xuICAgIGNoZWVzZUVsZW1lbnQuc3R5bGUudG9wID0gY2hlZXNlQ2VsbFBvcy55IC0gMTYgKyAncHgnXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChjaGVlc2VFbGVtZW50KVxuXG4gICAgbGV0IG1hemVNb3VzZSA9IG5ldyBtb3VzZShtb3VzZUNlbGxQb3MueCwgbW91c2VDZWxsUG9zLnkpXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChtYXplTW91c2UuZWxlbWVudClcblxuICAgIG9uVXBkYXRlKCh1cGRhdGUpID0+IHtcbiAgICAgICAgbGV0IG1vdXNlQ2VsbFBvcyA9IG1hemVEaXNwbGF5LmdldFBvcyh1cGRhdGUucG9zLnJvdywgdXBkYXRlLnBvcy5jb2wpXG5cbiAgICAgICAgbWF6ZU1vdXNlLm1vdmUobW91c2VDZWxsUG9zLngsIG1vdXNlQ2VsbFBvcy55LCA1MDApLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2codXBkYXRlLnN0ZXBDb3VudCArICcgLyAnICsgdXBkYXRlLnN0ZXBNYXgpXG4gICAgICAgIH0pXG4gICAgfSlcbn1cblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiB7XG4gICAgbGV0IHNvY2sgPSBzb2NrY2VwdGlvbi5jb25uZWN0KCd3czovLycgKyB3aW5kb3cubG9jYXRpb24uaG9zdG5hbWUgKyAnOjU2NjU3JylcblxuICAgIHNvY2sucm91dGUoJ2Nvbm5lY3RlZCcpLnJlY2VpdmVPbmUoKCkgPT4ge1xuICAgICAgICBsZXQgdXBkYXRlSGFuZGxlciA9ICgpID0+IHt9XG5cbiAgICAgICAgc29jay5yb3V0ZSgnZ2V0U3RhcnRzJykuc2VuZCgpLnJlY2VpdmVNYW55KChyZXMpID0+IHtcbiAgICAgICAgICAgIHN0YXJ0TmV3R2FtZShcbiAgICAgICAgICAgICAgICByZXMudmFsdWUsXG4gICAgICAgICAgICAgICAge3JvdzogMCwgY29sOiAwfSxcbiAgICAgICAgICAgICAgICBoYW5kbGVyID0+IHVwZGF0ZUhhbmRsZXIgPSBoYW5kbGVyXG4gICAgICAgICAgICApXG4gICAgICAgIH0pXG5cbiAgICAgICAgc29jay5yb3V0ZSgnZ2V0VXBkYXRlcycpLnNlbmQoKS5yZWNlaXZlTWFueShyZXMgPT4gdXBkYXRlSGFuZGxlcihyZXMudmFsdWUpKVxuXG4gICAgICAgIHNvY2sucm91dGUoJ2dldFN0b3BzJykucmVjZWl2ZU1hbnkoKHJlcykgPT4ge1xuICAgICAgICAgICAgc2V0VGltZW91dChjb25zb2xlLmxvZyhyZXMudmFsdWUpLCA1MDApXG4gICAgICAgIH0pXG5cbiAgICAgICAgc29jay5yb3V0ZSgnZ2V0Q3VycmVudCcpLnNlbmQoKS5yZWNlaXZlT25lKChyZXMpID0+IHtcbiAgICAgICAgICAgIGlmIChyZXMudmFsdWUgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBzb2NrLnJvdXRlKCdzdGFydCcpLnNlbmQoKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzdGFydE5ld0dhbWUoXG4gICAgICAgICAgICAgICAgICAgIHJlcy52YWx1ZS5lZGdlcyxcbiAgICAgICAgICAgICAgICAgICAgcmVzLnZhbHVlLnVwZGF0ZS5wb3MsXG4gICAgICAgICAgICAgICAgICAgIGhhbmRsZXIgPT4gdXBkYXRlSGFuZGxlciA9IGhhbmRsZXJcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfSlcbn0pXG4iLCIndXNlIHN0cmljdCdcblxubGV0IHNodWZmbGUgPSByZXF1aXJlKCdsb2Rhc2gvY29sbGVjdGlvbi9zaHVmZmxlJylcbmxldCBhbGwgPSByZXF1aXJlKCdsb2Rhc2gvY29sbGVjdGlvbi9hbGwnKVxuXG5sZXQgbWF6ZSA9IHt9XG5leHBvcnQgZGVmYXVsdCBtYXplXG5cbm1hemUuY2hlY2tFZGdlc0FuZEdldFNpemUgPSAoZWRnZXMpID0+IHtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkoZWRnZXMuaG9yaXpvbnRhbCkpIHtcbiAgICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG5cbiAgICBpZiAoIUFycmF5LmlzQXJyYXkoZWRnZXMudmVydGljYWwpKSB7XG4gICAgICAgIHJldHVybiBudWxsXG4gICAgfVxuXG4gICAgY29uc3Qgcm93cyA9IGVkZ2VzLnZlcnRpY2FsLmxlbmd0aFxuICAgIGNvbnN0IGNvbHMgPSBlZGdlcy5ob3Jpem9udGFsWzBdLmxlbmd0aFxuXG4gICAgaWYgKFxuICAgICAgICBhbGwoZWRnZXMudmVydGljYWwsIHJvdyA9PiBBcnJheS5pc0FycmF5KHJvdykgJiYgcm93Lmxlbmd0aCA9PT0gY29scyArIDEpICYmXG4gICAgICAgIGFsbChlZGdlcy5ob3Jpem9udGFsLCByb3cgPT4gQXJyYXkuaXNBcnJheShyb3cpICYmIHJvdy5sZW5ndGggPT09IGNvbHMpICYmXG4gICAgICAgIGFsbChbZWRnZXMudmVydGljYWwsIGVkZ2VzLmhvcml6b250YWxdLFxuICAgICAgICAgICAgZSA9PiBhbGwoZSxcbiAgICAgICAgICAgICAgICByb3cgPT4gYWxsKHJvdyxcbiAgICAgICAgICAgICAgICAgICAgZWRnZVVuaXQgPT4gdHlwZW9mIGVkZ2VVbml0ID09PSAnYm9vbGVhbidcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICApXG4gICAgICAgIClcbiAgICApIHtcbiAgICAgICAgcmV0dXJuIHtyb3dzLCBjb2xzfVxuICAgIH1cblxuICAgIHJldHVybiBudWxsXG59XG5cbm1hemUuZ3JpZCA9IChlZGdlcykgPT4ge1xuICAgIGxldCBhcGkgPSB7fVxuXG4gICAgYXBpLnNpemUgPSBtYXplLmNoZWNrRWRnZXNBbmRHZXRTaXplKGVkZ2VzKVxuXG4gICAgaWYgKCFhcGkuc2l6ZSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGVkZ2VzXCIpXG4gICAgfVxuXG4gICAgYXBpLmVkZ2VzID0gZWRnZXNcblxuICAgIGFwaS5jaGVja1BvcyA9ICh7cm93LCBjb2x9KSA9PiAoXG4gICAgICAgIDAgPD0gcm93ICYmIHJvdyA8IGFwaS5zaXplLnJvd3MgJiZcbiAgICAgICAgMCA8PSBjb2wgJiYgY29sIDwgYXBpLnNpemUuY29sc1xuICAgIClcblxuICAgIGFwaS5nZXRDZWxsID0gKHtyb3csIGNvbH0pID0+IHtcbiAgICAgICAgaWYgKCFhcGkuY2hlY2tQb3Moe3JvdywgY29sfSkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBwb3MnKVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgY3JlYXRlRWRnZSA9IChwb3MpID0+IHtcbiAgICAgICAgICAgIGlmICghYXBpLmNoZWNrUG9zKHBvcykpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBtYXRyaXggPSAoXG4gICAgICAgICAgICAgICAgcG9zLnJvdyAhPT0gcm93ID9cbiAgICAgICAgICAgICAgICBhcGkuZWRnZXMuaG9yaXpvbnRhbCA6XG4gICAgICAgICAgICAgICAgYXBpLmVkZ2VzLnZlcnRpY2FsXG4gICAgICAgICAgICApXG5cbiAgICAgICAgICAgIGNvbnN0IGVkZ2VQb3MgPSB7XG4gICAgICAgICAgICAgICAgcm93OiBNYXRoLm1heChyb3csIHBvcy5yb3cpLFxuICAgICAgICAgICAgICAgIGNvbDogTWF0aC5tYXgoY29sLCBwb3MuY29sKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGdldEVuYWJsZWQoKSB7IHJldHVybiBtYXRyaXhbZWRnZVBvcy5yb3ddW2VkZ2VQb3MuY29sXSB9LFxuICAgICAgICAgICAgICAgIHNldEVuYWJsZWQodmFsKSB7IG1hdHJpeFtlZGdlUG9zLnJvd11bZWRnZVBvcy5jb2xdID0gdmFsIH0sXG4gICAgICAgICAgICAgICAgZ2V0KCkgeyByZXR1cm4gYXBpLmdldENlbGwocG9zKSB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgaWQ6IHJvdyArIFwiLFwiICsgY29sLFxuICAgICAgICAgICAgZGF0YToge3JvdywgY29sfSxcbiAgICAgICAgICAgIGVkZ2VzOiB7XG4gICAgICAgICAgICAgICAgdXA6IGNyZWF0ZUVkZ2Uoe3Jvdzogcm93IC0gMSwgY29sOiBjb2x9KSxcbiAgICAgICAgICAgICAgICBkb3duOiBjcmVhdGVFZGdlKHtyb3c6IHJvdyArIDEsIGNvbDogY29sfSksXG4gICAgICAgICAgICAgICAgbGVmdDogY3JlYXRlRWRnZSh7cm93OiByb3csIGNvbDogY29sIC0gMX0pLFxuICAgICAgICAgICAgICAgIHJpZ2h0OiBjcmVhdGVFZGdlKHtyb3c6IHJvdywgY29sOiBjb2wgKyAxfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBhcGlcbn1cblxubWF6ZS5zaHVmZmxlID0gKGFyciwgcmFuZCkgPT4ge1xuICAgIGZvciAobGV0IGkgPSAwOyBpICE9PSBhcnIubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgY29uc3QgaiA9IGkgKyBNYXRoLmZsb29yKHJhbmQoKSAqIChhcnIubGVuZ3RoIC0gaSkpXG4gICAgICAgIGNvbnN0IHRtcCA9IGFycltpXVxuICAgICAgICBhcnJbaV0gPSBhcnJbal1cbiAgICAgICAgYXJyW2pdID0gdG1wXG4gICAgfVxufVxuXG5tYXplLmRlcHRoRmlyc3RQcnVuZSA9IChzZWVkQ2VsbCwgcmFuZCwgZG9TdHVmZiA9ICgpID0+IHt9KSA9PiB7IC8vIFRPRE86IHJhbmQgdW51c2VkXG4gICAgbGV0IHZpc2l0ZWRDZWxscyA9IHt9XG5cbiAgICBjb25zdCB2aXNpdCA9IChjZWxsLCBlbmFibGVFZGdlVG9HZXRIZXJlKSA9PiB7XG4gICAgICAgIGlmICh2aXNpdGVkQ2VsbHNbY2VsbC5pZF0pIHtcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgZW5hYmxlRWRnZVRvR2V0SGVyZSgpXG5cbiAgICAgICAgdmlzaXRlZENlbGxzW2NlbGwuaWRdID0gdHJ1ZVxuICAgICAgICBsZXQgZWRnZXMgPSBbXVxuXG4gICAgICAgIGZvciAobGV0IGRpcmVjdGlvbiBpbiBjZWxsLmVkZ2VzKSB7XG4gICAgICAgICAgICBjb25zdCBlZGdlID0gY2VsbC5lZGdlc1tkaXJlY3Rpb25dXG4gICAgICAgICAgICBpZiAoZWRnZSAmJiAhZWRnZS5nZXRFbmFibGVkKCkpIHtcbiAgICAgICAgICAgICAgICBlZGdlcy5wdXNoKGVkZ2UpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBzaHVmZmxlKGVkZ2VzKS5mb3JFYWNoKGVkZ2UgPT4ge1xuICAgICAgICAgICAgdmlzaXQoZWRnZS5nZXQoKSwgKCkgPT4gZWRnZS5zZXRFbmFibGVkKHRydWUpKVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIHZpc2l0KHNlZWRDZWxsLCAoKSA9PiB7fSlcbn1cblxuY29uc3QgZmlsbCA9IChsZW4sIHZhbCkgPT4ge1xuICAgIGxldCBhcnIgPSBuZXcgQXJyYXkobGVuKVxuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgIT09IGxlbjsgKytpKSB7XG4gICAgICAgIGFycltpXSA9IHZhbCgpXG4gICAgfVxuXG4gICAgcmV0dXJuIGFyclxufVxuXG5tYXplLmdlbmVyYXRlQmxhbmsgPSAoe3Jvd3MsIGNvbHN9KSA9PiB7XG4gICAgcmV0dXJuIG1hemUuZ3JpZCh7XG4gICAgICAgIGhvcml6b250YWw6IGZpbGwocm93cyArIDEsICgpID0+IGZpbGwoY29scywgKCkgPT4gZmFsc2UpKSxcbiAgICAgICAgdmVydGljYWw6IGZpbGwocm93cywgKCkgPT4gZmlsbChjb2xzICsgMSwgKCkgPT4gZmFsc2UpKVxuICAgIH0pXG59XG5cbm1hemUuZ2VuZXJhdGUgPSAoe3Jvd3MsIGNvbHN9KSA9PiB7XG4gICAgY29uc3QgcmVzdWx0ID0gbWF6ZS5nZW5lcmF0ZUJsYW5rKHtyb3dzLCBjb2xzfSlcbiAgICBtYXplLmRlcHRoRmlyc3RQcnVuZShyZXN1bHQuZ2V0Q2VsbCh7cm93OiAwLCBjb2w6IDB9KSwgTWF0aC5yYW5kb20pXG4gICAgcmV0dXJuIHJlc3VsdFxufVxuXG5tYXplLnByaW50ID0gKGdyaWQpID0+IHtcbiAgICBpZiAoZ3JpZC5zaXplLnJvd3MgPT09IDApIHtcbiAgICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgY29uc3QgcHJpbnRIb3Jpem9udGFsUm93ID0gKHJvdykgPT4ge1xuICAgICAgICBsZXQgc3RyID0gXCJcIlxuICAgICAgICByb3cuZm9yRWFjaCh4ID0+IHN0ciArPSBcIi5cIiArICh4ID8gXCIgXCIgOiBcIl9cIikpXG4gICAgICAgIHN0ciArPSBcIi5cIlxuICAgICAgICBjb25zb2xlLmxvZyhzdHIpXG4gICAgfVxuXG4gICAgY29uc3QgcHJpbnRWZXJ0aWNhbFJvdyA9IChyb3cpID0+IHtcbiAgICAgICAgbGV0IHN0ciA9IFwiXCJcbiAgICAgICAgcm93LmZvckVhY2goeCA9PiBzdHIgKz0gKHggPyBcIiBcIiA6IFwifFwiKSArIFwiIFwiKVxuICAgICAgICBjb25zb2xlLmxvZyhzdHIpXG4gICAgfVxuXG4gICAgcHJpbnRIb3Jpem9udGFsUm93KGdyaWQuZWRnZXMuaG9yaXpvbnRhbFswXSlcblxuICAgIGZvciAobGV0IGkgPSAwOyBpICE9PSBncmlkLnNpemUucm93czsgKytpKSB7XG4gICAgICAgIHByaW50VmVydGljYWxSb3coZ3JpZC5lZGdlcy52ZXJ0aWNhbFtpXSlcbiAgICAgICAgcHJpbnRIb3Jpem9udGFsUm93KGdyaWQuZWRnZXMuaG9yaXpvbnRhbFtpICsgMV0pXG4gICAgfVxufVxuIiwiJ3VzZSBzdHJpY3QnXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHgsIHkpIHtcbiAgICBsZXQgc2VsZiA9IHRoaXNcblxuICAgIHNlbGYueCA9IHhcbiAgICBzZWxmLnkgPSB5XG5cbiAgICBzZWxmLmVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgIHNlbGYuZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ21vdXNlJylcbiAgICBzZWxmLmVsZW1lbnQuc3R5bGUucG9zaXRpb24gPSAncmVsYXRpdmUnXG4gICAgc2VsZi5lbGVtZW50LnN0eWxlLndpZHRoID0gJzQ4cHgnXG4gICAgc2VsZi5lbGVtZW50LnN0eWxlLmhlaWdodCA9ICc0OHB4J1xuICAgIHNlbGYuZWxlbWVudC5zdHlsZS5vdmVyZmxvdyA9ICdoaWRkZW4nXG5cbiAgICBzZWxmLmltZ0VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKVxuICAgIHNlbGYuaW1nRWxlbWVudC5zcmMgPSAnYXNzZXRzL21vdXNlLnBuZydcbiAgICBzZWxmLmltZ0VsZW1lbnQuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnXG4gICAgc2VsZi5pbWdFbGVtZW50LnN0eWxlLmxlZnQgPSAnMHB4J1xuICAgIHNlbGYuaW1nRWxlbWVudC5zdHlsZS50b3AgPSAnMHB4J1xuICAgIHNlbGYuZWxlbWVudC5hcHBlbmRDaGlsZChzZWxmLmltZ0VsZW1lbnQpXG5cbiAgICBzZWxmLnVwZGF0ZVBvc2l0aW9uID0gKCkgPT4ge1xuICAgICAgICBzZWxmLmVsZW1lbnQuc3R5bGUubGVmdCA9IHNlbGYueCAtIDI0ICsgJ3B4J1xuICAgICAgICBzZWxmLmVsZW1lbnQuc3R5bGUudG9wID0gc2VsZi55IC0gMzIgKyAncHgnXG4gICAgfVxuXG4gICAgc2VsZi51cGRhdGVQb3NpdGlvbigpXG5cbiAgICBzZWxmLnVwZGF0ZUltYWdlQ2xpcCA9ICgpID0+IHtcbiAgICAgICAgbGV0IGxlZnQgPSA0OCAqIHNlbGYuY2xpcHBpbmdJbmRleFxuXG4gICAgICAgIGxldCB0b3AgPSB7XG4gICAgICAgICAgICAndXAnOiA0OCAqIDMsXG4gICAgICAgICAgICAnZG93bic6IDQ4ICogMCxcbiAgICAgICAgICAgICdsZWZ0JzogNDggKiAxLFxuICAgICAgICAgICAgJ3JpZ2h0JzogNDggKiAyXG4gICAgICAgIH1bc2VsZi5kaXJlY3Rpb25dXG5cbiAgICAgICAgc2VsZi5pbWdFbGVtZW50LnN0eWxlLmxlZnQgPSAtbGVmdCArICdweCdcbiAgICAgICAgc2VsZi5pbWdFbGVtZW50LnN0eWxlLnRvcCA9IC10b3AgKyAncHgnXG4gICAgfVxuXG4gICAgc2VsZi5kaXJlY3Rpb24gPSAnZG93bidcbiAgICBzZWxmLmNsaXBwaW5nSW5kZXggPSAwXG5cbiAgICBzZWxmLmNsaXBwaW5nU3RlcCA9ICgpID0+IHtcbiAgICAgICAgc2VsZi5jbGlwcGluZ0luZGV4KytcbiAgICAgICAgc2VsZi5jbGlwcGluZ0luZGV4ICU9IDRcbiAgICAgICAgc2VsZi51cGRhdGVJbWFnZUNsaXAoKVxuICAgIH1cblxuICAgIHNlbGYuY2xpcHBpbmdJbnRlcnZhbCA9IHNldEludGVydmFsKHNlbGYuY2xpcHBpbmdTdGVwLCAyNTApXG5cbiAgICBzZWxmLmNoYW5nZURpcmVjdGlvbiA9IChkaXJlY3Rpb24pID0+IHtcbiAgICAgICAgc2VsZi5kaXJlY3Rpb24gPSBkaXJlY3Rpb25cbiAgICAgICAgY2xlYXJJbnRlcnZhbChzZWxmLmNsaXBwaW5nSW50ZXJ2YWwpXG4gICAgICAgIHNlbGYudXBkYXRlSW1hZ2VDbGlwKClcbiAgICAgICAgc2VsZi5jbGlwcGluZ0ludGVydmFsID0gc2V0SW50ZXJ2YWwoc2VsZi5jbGlwcGluZ1N0ZXAsIDI1MClcbiAgICB9XG5cbiAgICBzZWxmLmFuaW1hdGlvblVwZGF0ZSA9ICgpID0+IHtcbiAgICAgICAgbGV0IGR0ID0gbmV3IERhdGUoKSAtIHNlbGYuYW5pbWF0aW9uLnN0YXJ0VGltZVxuXG4gICAgICAgIGlmIChkdCA+PSBzZWxmLmFuaW1hdGlvbi5kdXJhdGlvbikge1xuICAgICAgICAgICAgc2VsZi54ID0gc2VsZi5hbmltYXRpb24uZW5kWFxuICAgICAgICAgICAgc2VsZi55ID0gc2VsZi5hbmltYXRpb24uZW5kWVxuICAgICAgICAgICAgc2VsZi51cGRhdGVQb3NpdGlvbigpXG4gICAgICAgICAgICBzZWxmLmFuaW1hdGlvbi5yZXNvbHZlKClcbiAgICAgICAgICAgIHNlbGYuYW5pbWF0aW9uID0gbnVsbFxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICBsZXQgcCA9IGR0IC8gc2VsZi5hbmltYXRpb24uZHVyYXRpb25cbiAgICAgICAgc2VsZi54ID0gKDEgLSBwKSAqIHNlbGYuYW5pbWF0aW9uLnN0YXJ0WCArIHAgKiBzZWxmLmFuaW1hdGlvbi5lbmRYXG4gICAgICAgIHNlbGYueSA9ICgxIC0gcCkgKiBzZWxmLmFuaW1hdGlvbi5zdGFydFkgKyBwICogc2VsZi5hbmltYXRpb24uZW5kWVxuICAgICAgICBzZWxmLnVwZGF0ZVBvc2l0aW9uKClcbiAgICAgICAgc2VsZi5hbmltYXRpb24ucmVxdWVzdElkID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShzZWxmLmFuaW1hdGlvblVwZGF0ZSlcbiAgICB9XG5cbiAgICBzZWxmLmFuaW1hdGlvbiA9IG51bGxcblxuICAgIHNlbGYubW92ZSA9ICh4LCB5LCBkdXJhdGlvbikgPT4ge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSkge1xuICAgICAgICAgICAgbGV0IGR4ID0geCAtIHNlbGYueFxuICAgICAgICAgICAgbGV0IGR5ID0geSAtIHNlbGYueVxuXG4gICAgICAgICAgICBpZiAoTWF0aC5hYnMoZHgpID4gTWF0aC5hYnMoZHkpKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5jaGFuZ2VEaXJlY3Rpb24oZHggPiAwID8gJ3JpZ2h0JyA6ICdsZWZ0JylcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc2VsZi5jaGFuZ2VEaXJlY3Rpb24oZHkgPiAwID8gJ2Rvd24nIDogJ3VwJylcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHNlbGYuYW5pbWF0aW9uKSB7XG4gICAgICAgICAgICAgICAgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lKHNlbGYuYW5pbWF0aW9uLnJlcXVlc3RJZClcbiAgICAgICAgICAgICAgICBzZWxmLmFuaW1hdGlvbi5yZXNvbHZlKClcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc2VsZi5hbmltYXRpb24gPSB7XG4gICAgICAgICAgICAgICAgc3RhcnRUaW1lOiBuZXcgRGF0ZSgpLFxuICAgICAgICAgICAgICAgIGR1cmF0aW9uLFxuICAgICAgICAgICAgICAgIHN0YXJ0WDogc2VsZi54LFxuICAgICAgICAgICAgICAgIHN0YXJ0WTogc2VsZi55LFxuICAgICAgICAgICAgICAgIGVuZFg6IHgsXG4gICAgICAgICAgICAgICAgZW5kWTogeSxcbiAgICAgICAgICAgICAgICByZXF1ZXN0SWQ6IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoc2VsZi5hbmltYXRpb25VcGRhdGUpLFxuICAgICAgICAgICAgICAgIHJlc29sdmVcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9XG59XG4iXX0=
