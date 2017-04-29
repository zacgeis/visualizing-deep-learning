/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {
Object.defineProperty(exports, "__esModule", { value: true });
function getDimension(m) {
    var rows = m.length;
    var cols = m[0].length;
    return [rows, cols];
}
exports.getDimension = getDimension;
function generateZero(rows, cols) {
    return generate(rows, cols, function (row, col) { return 0; });
}
exports.generateZero = generateZero;
function generateRandom(rows, cols) {
    return generate(rows, cols, function (row, col) { return Math.random() * 2 - 1; });
}
exports.generateRandom = generateRandom;
function generate(rows, cols, values) {
    var m = new Array(rows);
    for (var row = 0; row < rows; row++) {
        m[row] = new Array(cols);
        for (var col = 0; col < cols; col++) {
            m[row][col] = values(row, col);
        }
    }
    return m;
}
exports.generate = generate;
function multiply(m1, m2) {
    var _a = getDimension(m1), m1Rows = _a[0], m1Cols = _a[1];
    var _b = getDimension(m2), m2Rows = _b[0], m2Cols = _b[1];
    if (m1Cols != m2Rows) {
        throw 'Matrix multiply size mismatch';
    }
    var result = generateZero(m1Rows, m2Cols);
    for (var m1Row = 0; m1Row < m1Rows; m1Row++) {
        for (var m2Col = 0; m2Col < m2Cols; m2Col++) {
            var sum = 0;
            for (var m1Col = 0; m1Col < m1Cols; m1Col++) {
                sum += m1[m1Row][m1Col] * m2[m1Col][m2Col];
            }
            result[m1Row][m2Col] = sum;
        }
    }
    return result;
}
exports.multiply = multiply;
function transpose(m) {
    var _a = getDimension(m), mRows = _a[0], mColumns = _a[1];
    return generate(mColumns, mRows, function (row, column) { return m[column][row]; });
}
exports.transpose = transpose;
function mapTwoToOne(m1, m2, operation) {
    var _a = getDimension(m1), m1Rows = _a[0], m1Cols = _a[1];
    var _b = getDimension(m2), m2Rows = _b[0], m2Cols = _b[1];
    if (m1Rows != m2Rows || m1Cols != m2Cols) {
        throw 'Matrix size mismatch';
    }
    return generate(m1Rows, m1Cols, function (row, col) { return operation(m1[row][col], m2[row][col]); });
}
exports.mapTwoToOne = mapTwoToOne;
function mapOneToOne(m, operation) {
    var _a = getDimension(m), rows = _a[0], cols = _a[1];
    return generate(rows, cols, function (row, col) { return operation(m[row][col]); });
}
exports.mapOneToOne = mapOneToOne;
function elementAdd(m1, m2) {
    return mapTwoToOne(m1, m2, function (val1, val2) { return val1 + val2; });
}
exports.elementAdd = elementAdd;
function elementSubtract(m1, m2) {
    return mapTwoToOne(m1, m2, function (val1, val2) { return val1 - val2; });
}
exports.elementSubtract = elementSubtract;
function elementMultiply(m1, m2) {
    return mapTwoToOne(m1, m2, function (val1, val2) { return val1 * val2; });
}
exports.elementMultiply = elementMultiply;
function scalar(x, m) {
    return mapOneToOne(m, function (val) { return x * val; });
}
exports.scalar = scalar;
function display(name, m) {
    console.log(name);
    var _a = getDimension(m), mRows = _a[0], mCols = _a[1];
    var cap = '';
    for (var col = 0; col < mCols; col++) {
        cap += ' ------';
    }
    process.stdout.write(cap + '\n');
    for (var row = 0; row < mRows; row++) {
        for (var col = 0; col < mCols; col++) {
            process.stdout.write(' ' + m[row][col].toString().substr(0, 6));
        }
        process.stdout.write('\n');
    }
    process.stdout.write(cap + '\n\n');
}
exports.display = display;
// (deltae)/(deltaw_1)=
// start with a hand generate random and zero matrix

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = React;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = ReactDOM;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__(1);
var ReactDOM = __webpack_require__(2);
var MatrixUtil = __webpack_require__(0);
function formatName(user) {
    return user.firstName + ' ' + user.lastName;
}
var user = {
    firstName: 'Harper',
    lastName: 'Perez'
};
// const element = (
//   <h1>
//     Hello, {formatName(user)}!
//   </h1>
// );
var weights = MatrixUtil.generateRandom(3, 4);
function matrixToTable(m) {
    var rowComponents = [];
    var _a = MatrixUtil.getDimension(m), mRows = _a[0], mCols = _a[1];
    for (var row = 0; row < mRows; row++) {
        var colComponents = [];
        for (var col = 0; col < mCols; col++) {
            var value = m[row][col].toString().substr(0, 8);
            colComponents.push(React.createElement("td", null, value));
        }
        rowComponents.push(React.createElement("tr", null, colComponents));
    }
    return (React.createElement("table", { className: "mdl-data-table mdl-js-data-table mdl-shadow--2dp" }, rowComponents));
}
var element = (React.createElement("table", null,
    React.createElement("tr", null,
        React.createElement("td", null,
            React.createElement("h6", null, "Weights"),
            matrixToTable(weights)))));
ReactDOM.render(element, document.getElementById('root'));
// <table>
// 	<tr>
// 		<td>
// 			<h6>Weights</h6>
// 			<table class="mdl-data-table mdl-js-data-table mdl-shadow--2dp">
// 				<tbody>
// 					<tr>
// 						<td>25</td>
// 						<td>25</td>
// 						<td>$2.90</td>
// 					</tr>
// 					<tr>
// 						<td>25</td>
// 						<td>25</td>
// 						<td>$2.90</td>
// 					</tr>
// 					<tr>
// 						<td>25</td>
// 						<td>25</td>
// 						<td>$2.90</td>
// 					</tr>
// 				</tbody>
// 			</table>
// 		</td>
// 		<td>
// 			<h6>Weights</h6>
// 			<table class="mdl-data-table mdl-js-data-table mdl-shadow--2dp">
// 				<tbody>
// 					<tr>
// 						<td>25</td>
// 						<td>25</td>
// 						<td>$2.90</td>
// 					</tr>
// 					<tr>
// 						<td>25</td>
// 						<td>25</td>
// 						<td>$2.90</td>
// 					</tr>
// 					<tr>
// 						<td>25</td>
// 						<td>25</td>
// 						<td>$2.90</td>
// 					</tr>
// 				</tbody>
// 			</table>
// 		</td>
// 	</tr>
// </table>


/***/ }),
/* 4 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
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
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ })
/******/ ]);