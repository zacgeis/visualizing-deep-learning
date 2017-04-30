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
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
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
function sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
}
exports.sigmoid = sigmoid;
function sigmoidDeriv(x) {
    return sigmoid(x) * (1 - sigmoid(x));
}
exports.sigmoidDeriv = sigmoidDeriv;
function relu(x) {
    if (x > 0) {
        return x;
    }
    else {
        return 0;
    }
}
exports.relu = relu;
function reluDeriv(x) {
    if (x > 0) {
        return 1;
    }
    else {
        return 0;
    }
}
exports.reluDeriv = reluDeriv;
function sumSquaredError(actual, expected) {
    var _a = getDimension(actual), actualRows = _a[0], actualCols = _a[1];
    var _b = getDimension(expected), expectedRows = _b[0], expectedCols = _b[1];
    if (actualRows != expectedRows || actualCols != expectedCols) {
        throw 'Matrix size mismatch';
    }
    var result = 0;
    for (var row = 0; row < actualRows; row++) {
        for (var col = 0; col < actualCols; col++) {
            result += Math.pow(actual[row][col] - expected[row][col], 2);
        }
    }
    return result / 2;
}
exports.sumSquaredError = sumSquaredError;
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
function weightToColor(weight) {
    var alpha = (Math.min(100, Math.abs(weight * 25)) / 100).toString().substr(0, 4);
    if (weight < 0) {
        return 'rgba(0, 255, 255, ' + alpha + ')';
    }
    return 'rgba(255, 150, 0, ' + alpha + ')';
}
exports.weightToColor = weightToColor;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6)))

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = Plotly;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = React;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = ReactDOM;

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = katex;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__(2);
var ReactDOM = __webpack_require__(3);
var MatrixUtil = __webpack_require__(0);
var katex = __webpack_require__(4);
var Plotly = __webpack_require__(1);
var MatrixTable = (function (_super) {
    __extends(MatrixTable, _super);
    function MatrixTable(props) {
        return _super.call(this, props) || this;
    }
    MatrixTable.prototype.render = function () {
        var rowComponents = [];
        var _a = MatrixUtil.getDimension(this.props.matrix), mRows = _a[0], mCols = _a[1];
        for (var row = 0; row < mRows; row++) {
            var colComponents = [];
            for (var col = 0; col < mCols; col++) {
                var value = this.props.matrix[row][col];
                if (!this.props.fullString) {
                    value = value.toString().substr(0, 8);
                }
                var style = {};
                if (this.props.colorize) {
                    style['background-color'] = MatrixUtil.weightToColor(this.props.matrix[row][col]);
                }
                colComponents.push(React.createElement("td", { style: style }, value));
            }
            rowComponents.push(React.createElement("tr", null, colComponents));
        }
        return (React.createElement("table", { className: "matrix-table" }, rowComponents));
    };
    return MatrixTable;
}(React.Component));
var PlotlyGraph = (function (_super) {
    __extends(PlotlyGraph, _super);
    function PlotlyGraph(props) {
        return _super.call(this, props) || this;
    }
    PlotlyGraph.prototype.componentDidUpdate = function () {
        this.plotlyRender();
    };
    PlotlyGraph.prototype.componentDidMount = function () {
        this.plotlyRender();
    };
    PlotlyGraph.prototype.render = function () {
        var _this = this;
        return React.createElement("div", { ref: function (input) { _this.graphDiv = input; } });
    };
    PlotlyGraph.prototype.plotlyRender = function () {
        Plotly.purge(this.graphDiv);
        var layout = {
            width: this.props.width,
            height: this.props.height,
            title: this.props.title,
            xaxis: {
                title: 'Iterations'
            }
        };
        var data = this.props.plotData.getPlotlyFormattedData();
        Plotly.newPlot(this.graphDiv, data, layout);
    };
    return PlotlyGraph;
}(React.Component));
var PlotData = (function () {
    function PlotData() {
        this.index = 0;
        this.iteration = [];
        this.traces = {};
    }
    PlotData.prototype.addPoints = function (points) {
        this.iteration.push(this.index++);
        for (var name_1 in points) {
            if (!this.traces.hasOwnProperty(name_1)) {
                this.traces[name_1] = [];
            }
            this.traces[name_1].push(points[name_1]);
        }
    };
    PlotData.prototype.getSingleTrace = function (name, values) {
        return {
            x: this.iteration,
            y: values,
            mode: 'lines',
            name: name,
            line: {
                width: 1
            }
        };
    };
    PlotData.prototype.getPlotlyFormattedData = function () {
        var data = [];
        for (var name_2 in this.traces) {
            data.push(this.getSingleTrace(name_2, this.traces[name_2]));
        }
        return data;
    };
    return PlotData;
}());
function generateNetworkState(count, learningRate, hiddenLayerSize) {
    var inputData = [
        [0, 0, 1],
        [0, 1, 1],
        [1, 0, 1],
        [1, 1, 1],
    ];
    var outputTarget = [
        [0],
        [1],
        [1],
        [0],
    ];
    var iterations = [];
    var plotData = new PlotData();
    var sumSquaredError = 0;
    var weights1 = MatrixUtil.generateRandom(3, hiddenLayerSize);
    var weights2 = MatrixUtil.generateRandom(hiddenLayerSize, 1);
    for (var i = 0; i <= count; i++) {
        var hiddenSum1 = MatrixUtil.multiply(inputData, weights1);
        var hiddenResult1 = MatrixUtil.mapOneToOne(hiddenSum1, MatrixUtil.sigmoid);
        var hiddenSum2 = MatrixUtil.multiply(hiddenResult1, weights2);
        var hiddenResult2 = MatrixUtil.mapOneToOne(hiddenSum2, MatrixUtil.sigmoid);
        var error2 = MatrixUtil.elementSubtract(outputTarget, hiddenResult2);
        var gradients2 = MatrixUtil.mapOneToOne(hiddenSum2, MatrixUtil.sigmoidDeriv);
        var delta2 = MatrixUtil.elementMultiply(gradients2, error2);
        var error1 = MatrixUtil.multiply(delta2, MatrixUtil.transpose(weights2));
        var gradients1 = MatrixUtil.mapOneToOne(hiddenSum1, MatrixUtil.sigmoidDeriv);
        var delta1 = MatrixUtil.elementMultiply(gradients1, error1);
        var weightUpdates1 = MatrixUtil.scalar(learningRate, MatrixUtil.multiply(MatrixUtil.transpose(inputData), delta1));
        var weightUpdates2 = MatrixUtil.scalar(learningRate, MatrixUtil.multiply(MatrixUtil.transpose(hiddenResult1), delta2));
        iterations.push([
            {
                weights: weights1,
                hiddenSum: hiddenSum1,
                hiddenResult: hiddenResult1,
                error: error1,
                gradients: gradients1,
                delta: delta1,
                weightUpdates: weightUpdates1
            },
            {
                weights: weights2,
                hiddenSum: hiddenSum2,
                hiddenResult: hiddenResult2,
                error: error2,
                gradients: gradients2,
                delta: delta2,
                weightUpdates: weightUpdates2
            }
        ]);
        weights1 = MatrixUtil.elementAdd(weightUpdates1, weights1);
        weights2 = MatrixUtil.elementAdd(weightUpdates2, weights2);
        sumSquaredError = MatrixUtil.sumSquaredError(hiddenResult2, outputTarget);
        plotData.addPoints({
            error: sumSquaredError,
        });
    }
    return {
        learningRate: learningRate,
        inputData: inputData,
        outputTarget: outputTarget,
        iterations: iterations,
        plotData: plotData,
        finalError: sumSquaredError
    };
}
var IterationSlider = (function (_super) {
    __extends(IterationSlider, _super);
    function IterationSlider(props) {
        var _this = _super.call(this, props) || this;
        _this.handleChange = _this.handleChange.bind(_this);
        return _this;
    }
    IterationSlider.prototype.handleChange = function (event) {
        var value = event.target.value;
        this.props.onIterationChange(value);
    };
    IterationSlider.prototype.render = function () {
        return (React.createElement("div", { className: "iteration-slider" },
            React.createElement("div", null,
                "Iteration (of ",
                this.props.max,
                "): ",
                this.props.value),
            React.createElement("input", { type: "range", onChange: this.handleChange, min: this.props.min, max: this.props.max, value: this.props.value, step: "1" })));
    };
    return IterationSlider;
}(React.Component));
var MathIntro = (function (_super) {
    __extends(MathIntro, _super);
    function MathIntro(props) {
        return _super.call(this, props) || this;
    }
    MathIntro.prototype.componentDidUpdate = function () {
        this.renderLatex();
    };
    MathIntro.prototype.componentDidMount = function () {
        this.renderLatex();
    };
    MathIntro.prototype.renderLatex = function () {
        katex.render("s(x) = \\frac{1}{1 + e^{-x}}", this.sigmoidElement);
        katex.render("s'(x) = \\frac{ds(x)}{dx} = s(x)(1 - s(x))", this.sigmoidDerivElement);
    };
    MathIntro.prototype.render = function () {
        var _this = this;
        var x22 = [['x11', 'x12'], ['x21', 'x22']];
        var y22 = [['y11', 'y12'], ['y21', 'y22']];
        var plus = [['x11 + y11', 'x12 + y12'], ['x21 + y21', 'x22 + y22']];
        var adot = [['a*x11', 'a*x12'], ['a*x21', 'a*x22']];
        var fx = [['f(x11)', 'f(x12)'], ['f(x21)', 'f(x22)']];
        var x23 = [['x11', 'x12', 'x13'], ['x21', 'x22', 'x23']];
        var transpose = [['x11', '21'], ['x12', '22'], ['x21', '23']];
        var y32 = [['y11', 'y12'], ['y21', 'y22'], ['y31', 'y32']];
        var xydot = [
            [
                'x11*y11 + x12*y21 + x13*y31',
                'x11*y12 + x12*y22 + x13*y32',
            ],
            [
                'x21*y11 + x22*y21 + x23*y31',
                'x21*y12 + x22*y22 + x23*y32',
            ]
        ];
        return (React.createElement("div", { className: "math-intro" },
            React.createElement("div", { className: "math-intro-header" }, "Brief Function Guide:"),
            React.createElement("div", { className: "math", ref: function (input) { _this.sigmoidElement = input; } }),
            React.createElement("div", { className: "math", ref: function (input) { _this.sigmoidDerivElement = input; } }),
            React.createElement("table", { className: "display-table" },
                React.createElement("tr", null,
                    React.createElement("td", null,
                        React.createElement(MatrixTable, { matrix: x22, colorize: false, fullString: true })),
                    React.createElement("td", { className: "symbol" }, "+"),
                    React.createElement("td", null,
                        React.createElement(MatrixTable, { matrix: y22, colorize: false, fullString: true })),
                    React.createElement("td", { className: "symbol" }, "="),
                    React.createElement("td", null,
                        React.createElement(MatrixTable, { matrix: plus, colorize: false, fullString: true })))),
            React.createElement("table", { className: "display-table" },
                React.createElement("tr", null,
                    React.createElement("td", null,
                        React.createElement(MatrixTable, { matrix: x23, colorize: false, fullString: true })),
                    React.createElement("td", { className: "symbol" }, "\u00B7"),
                    React.createElement("td", null,
                        React.createElement(MatrixTable, { matrix: y32, colorize: false, fullString: true })),
                    React.createElement("td", { className: "symbol" }, "="),
                    React.createElement("td", null,
                        React.createElement(MatrixTable, { matrix: xydot, colorize: false, fullString: true })))),
            React.createElement("table", { className: "display-table" },
                React.createElement("tr", null,
                    React.createElement("td", null, "a"),
                    React.createElement("td", { className: "symbol" }, "\u00B7"),
                    React.createElement("td", null,
                        React.createElement(MatrixTable, { matrix: x22, colorize: false, fullString: true })),
                    React.createElement("td", { className: "symbol" }, "="),
                    React.createElement("td", null,
                        React.createElement(MatrixTable, { matrix: adot, colorize: false, fullString: true })))),
            React.createElement("table", { className: "display-table" },
                React.createElement("tr", null,
                    React.createElement("td", { className: "symbol" }, "T("),
                    React.createElement("td", null,
                        React.createElement(MatrixTable, { matrix: x23, colorize: false, fullString: true })),
                    React.createElement("td", { className: "symbol" }, ")="),
                    React.createElement("td", null,
                        React.createElement(MatrixTable, { matrix: transpose, colorize: false, fullString: true })))),
            React.createElement("table", { className: "display-table" },
                React.createElement("tr", null,
                    React.createElement("td", { className: "symbol" }, "f("),
                    React.createElement("td", null,
                        React.createElement(MatrixTable, { matrix: x22, colorize: false, fullString: true })),
                    React.createElement("td", { className: "symbol" }, ")="),
                    React.createElement("td", null,
                        React.createElement(MatrixTable, { matrix: fx, colorize: false, fullString: true }))))));
    };
    return MathIntro;
}(React.Component));
var NetworkGraph = (function (_super) {
    __extends(NetworkGraph, _super);
    function NetworkGraph(props) {
        return _super.call(this, props) || this;
    }
    NetworkGraph.prototype.componentDidUpdate = function () {
        this.renderCanvasGraph();
    };
    NetworkGraph.prototype.componentDidMount = function () {
        this.renderCanvasGraph();
    };
    NetworkGraph.prototype.renderCanvasGraph = function () {
        var ctx = this.canvasElement.getContext('2d');
        ctx.clearRect(0, 0, 250, 400);
        var styledWeights1 = this.props.styledWeights1;
        var styledWeights2 = this.props.styledWeights2;
        var height = this.props.height;
        var verticalSep = 30;
        var horizontalSep = 60;
        var nodeRadius = 10;
        var layer1Count = styledWeights1.length;
        var layer2Count = styledWeights1[0].length;
        var layer3Count = styledWeights2[0].length;
        var layer1Locs = [];
        var layer2Locs = [];
        var layer3Locs = [];
        var totalNodeHeight = nodeRadius * 2 + verticalSep;
        var totalNodeWidth = nodeRadius * 2 + horizontalSep;
        var x = (this.props.width / 2) - ((totalNodeWidth * (3 - 1)) / 2);
        var layer1StartY = (height / 2) - ((totalNodeHeight * (layer1Count - 1)) / 2);
        var layer2StartY = (height / 2) - ((totalNodeHeight * (layer2Count - 1)) / 2);
        var layer3StartY = (height / 2) - ((totalNodeHeight * (layer3Count - 1)) / 2);
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'rgba(0, 0 , 0, 1)';
        for (var i = 0; i < layer1Count; i++) {
            ctx.beginPath();
            ctx.arc(x, layer1StartY, nodeRadius, 0, Math.PI * 2, true);
            layer1Locs.push([x, layer1StartY]);
            layer1StartY += totalNodeHeight;
            ctx.stroke();
        }
        x += totalNodeWidth;
        for (var i = 0; i < layer2Count; i++) {
            ctx.beginPath();
            ctx.arc(x, layer2StartY, nodeRadius, 0, Math.PI * 2, true);
            layer2Locs.push([x, layer2StartY]);
            layer2StartY += totalNodeHeight;
            ctx.stroke();
        }
        x += totalNodeWidth;
        for (var i = 0; i < layer3Count; i++) {
            ctx.beginPath();
            ctx.arc(x, layer3StartY, nodeRadius, 0, Math.PI * 2, true);
            layer3Locs.push([x, layer3StartY]);
            layer3StartY += totalNodeHeight;
            ctx.stroke();
        }
        ctx.lineWidth = 2;
        for (var i = 0; i < layer1Locs.length; i++) {
            for (var j = 0; j < layer2Locs.length; j++) {
                ctx.beginPath();
                ctx.strokeStyle = styledWeights1[i][j];
                ctx.moveTo(layer1Locs[i][0], layer1Locs[i][1]);
                ctx.lineTo(layer2Locs[j][0], layer2Locs[j][1]);
                ctx.stroke();
            }
        }
        for (var i = 0; i < layer2Locs.length; i++) {
            for (var j = 0; j < layer3Locs.length; j++) {
                ctx.beginPath();
                ctx.strokeStyle = styledWeights2[i][j];
                ctx.moveTo(layer2Locs[i][0], layer2Locs[i][1]);
                ctx.lineTo(layer3Locs[j][0], layer3Locs[j][1]);
                ctx.stroke();
            }
        }
    };
    NetworkGraph.prototype.render = function () {
        var _this = this;
        return React.createElement("canvas", { ref: function (input) { _this.canvasElement = input; }, width: this.props.width, height: this.props.height });
    };
    return NetworkGraph;
}(React.Component));
var SingleLayerDisplay = (function (_super) {
    __extends(SingleLayerDisplay, _super);
    function SingleLayerDisplay(props) {
        var _this = _super.call(this, props) || this;
        var defaultCount = 10;
        var defaultLearningRate = 0.1;
        var defaultHiddenLayerSize = 4;
        _this.state = {
            networkState: generateNetworkState(defaultCount, defaultLearningRate, defaultHiddenLayerSize),
            learningRate: defaultLearningRate,
            count: defaultCount,
            hiddenLayerSize: defaultHiddenLayerSize,
            tempHiddenLayerSize: defaultHiddenLayerSize,
            tempLearningRate: defaultLearningRate,
            tempCount: defaultCount,
            iteration: defaultCount
        };
        _this.handleIterationChange = _this.handleIterationChange.bind(_this);
        _this.handleLearningRateChange = _this.handleLearningRateChange.bind(_this);
        _this.handleIterationCountChange = _this.handleIterationCountChange.bind(_this);
        _this.handleHiddenLayerSizeChange = _this.handleHiddenLayerSizeChange.bind(_this);
        _this.handleGenerate = _this.handleGenerate.bind(_this);
        return _this;
    }
    SingleLayerDisplay.prototype.handleIterationChange = function (iteration) {
        this.setState({
            iteration: iteration
        });
    };
    SingleLayerDisplay.prototype.handleLearningRateChange = function (event) {
        this.setState({
            tempLearningRate: event.target.value
        });
    };
    SingleLayerDisplay.prototype.handleIterationCountChange = function (event) {
        this.setState({
            tempCount: event.target.value
        });
    };
    SingleLayerDisplay.prototype.handleHiddenLayerSizeChange = function (event) {
        this.setState({
            tempHiddenLayerSize: event.target.value
        });
    };
    SingleLayerDisplay.prototype.handleGenerate = function () {
        var newState = generateNetworkState(this.state.tempCount, this.state.tempLearningRate, this.state.tempHiddenLayerSize);
        this.setState({
            count: this.state.tempCount,
            iteration: this.state.tempCount,
            learningRate: this.state.tempLearningRate,
            networkState: newState,
            hiddenLayerSize: this.state.tempHiddenLayerSize
        });
    };
    SingleLayerDisplay.prototype.render = function () {
        var layer1 = this.state.networkState.iterations[this.state.iteration][0];
        var layer2 = this.state.networkState.iterations[this.state.iteration][1];
        var finalError = this.state.networkState.finalError;
        var plotData = this.state.networkState.plotData;
        var styledWeights1 = MatrixUtil.mapOneToOne(layer1.weights, function (weight) { return MatrixUtil.weightToColor(weight); });
        var styledWeights2 = MatrixUtil.mapOneToOne(layer2.weights, function (weight) { return MatrixUtil.weightToColor(weight); });
        return (React.createElement("div", null,
            React.createElement(MathIntro, null),
            React.createElement("div", { className: "input-section" },
                React.createElement("div", { className: "input-field" },
                    "Hidden Layer Size: ",
                    React.createElement("input", { value: this.state.tempHiddenLayerSize, onInput: this.handleHiddenLayerSizeChange })),
                React.createElement("div", { className: "input-field" },
                    "Learning Rate: ",
                    React.createElement("input", { value: this.state.tempLearningRate, onInput: this.handleLearningRateChange })),
                React.createElement("div", { className: "input-field" },
                    "Iteration Count: ",
                    React.createElement("input", { value: this.state.tempCount, onInput: this.handleIterationCountChange })),
                React.createElement("button", { className: "generate-button", onClick: this.handleGenerate }, "Generate")),
            React.createElement("table", null,
                React.createElement("tr", null,
                    React.createElement("td", null,
                        React.createElement("div", { className: "display-field" },
                            "Hidden Layer Size: ",
                            this.state.hiddenLayerSize),
                        React.createElement("div", { className: "display-field" },
                            "Learning Rate: ",
                            this.state.learningRate),
                        React.createElement("div", { className: "display-field" },
                            "Iteration Count: ",
                            this.state.count),
                        React.createElement("div", { className: "display-field" },
                            "Final Error: ",
                            finalError),
                        React.createElement(IterationSlider, { min: 0, max: this.state.count, value: this.state.iteration, onIterationChange: this.handleIterationChange })),
                    React.createElement("td", null,
                        React.createElement(NetworkGraph, { styledWeights1: styledWeights1, styledWeights2: styledWeights2, height: 300, width: 300 })),
                    React.createElement("td", null,
                        React.createElement(PlotlyGraph, { plotData: plotData, title: "Error", height: 300, width: 400 })))),
            React.createElement("div", { className: "section" },
                React.createElement("div", { className: "section-header" }, "Forward Pass: "),
                React.createElement("table", { className: "display-table" },
                    React.createElement("tr", null,
                        React.createElement("td", null,
                            React.createElement("div", { className: "matrix-header" }, "L1 Weighted Sum"),
                            React.createElement(MatrixTable, { matrix: layer1.hiddenSum, colorize: false })),
                        React.createElement("td", { className: "symbol" }, "="),
                        React.createElement("td", null,
                            React.createElement("div", { className: "matrix-header" }, "Inputs"),
                            React.createElement(MatrixTable, { matrix: this.state.networkState.inputData, colorize: false })),
                        React.createElement("td", { className: "symbol" }, "\u00B7"),
                        React.createElement("td", null,
                            React.createElement("div", { className: "matrix-header" }, "L1 Weights"),
                            React.createElement(MatrixTable, { matrix: layer1.weights, colorize: true })))),
                React.createElement("table", { className: "display-table" },
                    React.createElement("tr", null,
                        React.createElement("td", null,
                            React.createElement("div", { className: "matrix-header" }, "L1 Output"),
                            React.createElement(MatrixTable, { matrix: layer1.hiddenResult, colorize: false })),
                        React.createElement("td", { className: "symbol" }, "= S("),
                        React.createElement("td", null,
                            React.createElement("div", { className: "matrix-header" }, "L1 Weighted Sum"),
                            React.createElement(MatrixTable, { matrix: layer1.hiddenSum, colorize: false })),
                        React.createElement("td", { className: "symbol" }, ")"))),
                React.createElement("table", { className: "display-table" },
                    React.createElement("tr", null,
                        React.createElement("td", null,
                            React.createElement("div", { className: "matrix-header" }, "L2 Weighted Sum"),
                            React.createElement(MatrixTable, { matrix: layer2.hiddenSum, colorize: false })),
                        React.createElement("td", { className: "symbol" }, "="),
                        React.createElement("td", null,
                            React.createElement("div", { className: "matrix-header" }, "Inputs (L1 Output)"),
                            React.createElement(MatrixTable, { matrix: layer1.hiddenResult, colorize: false })),
                        React.createElement("td", { className: "symbol" }, "\u00B7"),
                        React.createElement("td", null,
                            React.createElement("div", { className: "matrix-header" }, "L2 Weights"),
                            React.createElement(MatrixTable, { matrix: layer2.weights, colorize: true })))),
                React.createElement("table", { className: "display-table" },
                    React.createElement("tr", null,
                        React.createElement("td", null,
                            React.createElement("div", { className: "matrix-header" }, "L2 Output (Final Result)"),
                            React.createElement(MatrixTable, { matrix: layer2.hiddenResult, colorize: false })),
                        React.createElement("td", { className: "symbol" }, "= S("),
                        React.createElement("td", null,
                            React.createElement("div", { className: "matrix-header" }, "L2 Weighted Sum"),
                            React.createElement(MatrixTable, { matrix: layer2.hiddenSum, colorize: false })),
                        React.createElement("td", { className: "symbol" }, ")"))),
                React.createElement("div", { className: "section-header" }, "Output: "),
                React.createElement("table", { className: "display-table" },
                    React.createElement("tr", null,
                        React.createElement("td", null,
                            React.createElement("div", { className: "matrix-header" }, "L2 Error"),
                            React.createElement(MatrixTable, { matrix: layer2.error, colorize: false })),
                        React.createElement("td", { className: "symbol" }, "="),
                        React.createElement("td", null,
                            React.createElement("div", { className: "matrix-header" }, "Target Output"),
                            React.createElement(MatrixTable, { matrix: this.state.networkState.outputTarget, colorize: false })),
                        React.createElement("td", { className: "symbol" }, "-"),
                        React.createElement("td", null,
                            React.createElement("div", { className: "matrix-header" }, "L2 Output"),
                            React.createElement(MatrixTable, { matrix: layer2.hiddenResult, colorize: false }))))),
            React.createElement("div", { className: "section" },
                React.createElement("div", { className: "section-header" }, "Back Propagation Pass: "),
                React.createElement("table", { className: "display-table" },
                    React.createElement("tr", null,
                        React.createElement("td", null,
                            React.createElement("div", { className: "matrix-header" }, "L2 Gradients"),
                            React.createElement(MatrixTable, { matrix: layer2.gradients, colorize: false })),
                        React.createElement("td", { className: "symbol" }, "= S'("),
                        React.createElement("td", null,
                            React.createElement("div", { className: "matrix-header" }, "L2 Weighted Sum"),
                            React.createElement(MatrixTable, { matrix: layer2.hiddenSum, colorize: false })),
                        React.createElement("td", { className: "symbol" }, ")"))),
                React.createElement("table", { className: "display-table" },
                    React.createElement("tr", null,
                        React.createElement("td", null,
                            React.createElement("div", { className: "matrix-header" }, "L2 Delta"),
                            React.createElement(MatrixTable, { matrix: layer2.delta, colorize: false })),
                        React.createElement("td", { className: "symbol" }, "="),
                        React.createElement("td", null,
                            React.createElement("div", { className: "matrix-header" }, "L2 Gradients"),
                            React.createElement(MatrixTable, { matrix: layer2.gradients, colorize: false })),
                        React.createElement("td", { className: "symbol" }, "x"),
                        React.createElement("td", null,
                            React.createElement("div", { className: "matrix-header" }, "L2 Error"),
                            React.createElement(MatrixTable, { matrix: layer2.error, colorize: false })))),
                React.createElement("table", { className: "display-table" },
                    React.createElement("tr", null,
                        React.createElement("td", null,
                            React.createElement("div", { className: "matrix-header" }, "L1 Error"),
                            React.createElement(MatrixTable, { matrix: layer1.error, colorize: false })),
                        React.createElement("td", { className: "symbol" }, "="),
                        React.createElement("td", null,
                            React.createElement("div", { className: "matrix-header" }, "L2 Delta"),
                            React.createElement(MatrixTable, { matrix: layer2.delta, colorize: false })),
                        React.createElement("td", { className: "symbol" }, "\u00B7T("),
                        React.createElement("td", null,
                            React.createElement("div", { className: "matrix-header" }, "L2 Weights"),
                            React.createElement(MatrixTable, { matrix: layer2.weights, colorize: false })),
                        React.createElement("td", { className: "symbol" }, ")"))),
                React.createElement("table", { className: "display-table" },
                    React.createElement("tr", null,
                        React.createElement("td", null,
                            React.createElement("div", { className: "matrix-header" }, "L1 Gradients"),
                            React.createElement(MatrixTable, { matrix: layer1.gradients, colorize: false })),
                        React.createElement("td", { className: "symbol" }, "= S'("),
                        React.createElement("td", null,
                            React.createElement("div", { className: "matrix-header" }, "L1 Hidden Sum"),
                            React.createElement(MatrixTable, { matrix: layer1.hiddenSum, colorize: false })),
                        React.createElement("td", { className: "symbol" }, ")"))),
                React.createElement("table", { className: "display-table" },
                    React.createElement("tr", null,
                        React.createElement("td", null,
                            React.createElement("div", { className: "matrix-header" }, "L1 Delta"),
                            React.createElement(MatrixTable, { matrix: layer1.delta, colorize: false })),
                        React.createElement("td", { className: "symbol" }, "="),
                        React.createElement("td", null,
                            React.createElement("div", { className: "matrix-header" }, "L1 Gradients"),
                            React.createElement(MatrixTable, { matrix: layer1.gradients, colorize: false })),
                        React.createElement("td", { className: "symbol" }, "x"),
                        React.createElement("td", null,
                            React.createElement("div", { className: "matrix-header" }, "L1 Error"),
                            React.createElement(MatrixTable, { matrix: layer1.error, colorize: false })))),
                React.createElement("table", { className: "display-table" },
                    React.createElement("tr", null,
                        React.createElement("td", null,
                            React.createElement("div", { className: "matrix-header" }, "L1 Weight Updates"),
                            React.createElement(MatrixTable, { matrix: layer1.weightUpdates, colorize: false })),
                        React.createElement("td", { className: "symbol" },
                            "= ",
                            this.state.learningRate,
                            " \u00B7 T("),
                        React.createElement("td", null,
                            React.createElement("div", { className: "matrix-header" }, "Inputs"),
                            React.createElement(MatrixTable, { matrix: this.state.networkState.inputData, colorize: false })),
                        React.createElement("td", { className: "symbol" }, ")\u00B7"),
                        React.createElement("td", null,
                            React.createElement("div", { className: "matrix-header" }, "L1 Delta"),
                            React.createElement(MatrixTable, { matrix: layer1.delta, colorize: false })))),
                React.createElement("table", { className: "display-table" },
                    React.createElement("tr", null,
                        React.createElement("td", null,
                            React.createElement("div", { className: "matrix-header" }, "L2 Weight Updates"),
                            React.createElement(MatrixTable, { matrix: layer2.weightUpdates, colorize: false })),
                        React.createElement("td", { className: "symbol" },
                            "= ",
                            this.state.learningRate,
                            " \u00B7 T("),
                        React.createElement("td", null,
                            React.createElement("div", { className: "matrix-header" }, "L1 Output"),
                            React.createElement(MatrixTable, { matrix: layer1.hiddenResult, colorize: false })),
                        React.createElement("td", { className: "symbol" }, ")\u00B7"),
                        React.createElement("td", null,
                            React.createElement("div", { className: "matrix-header" }, "L2 Delta"),
                            React.createElement(MatrixTable, { matrix: layer2.delta, colorize: false })))),
                React.createElement("table", { className: "display-table" },
                    React.createElement("tr", null,
                        React.createElement("td", null,
                            React.createElement("div", { className: "matrix-header" }, "New L1 Weights"),
                            React.createElement(MatrixTable, { matrix: MatrixUtil.elementAdd(layer1.weightUpdates, layer1.weights), colorize: true })),
                        React.createElement("td", { className: "symbol" }, "="),
                        React.createElement("td", null,
                            React.createElement("div", { className: "matrix-header" }, "L1 Delta"),
                            React.createElement(MatrixTable, { matrix: layer1.weights, colorize: true })),
                        React.createElement("td", { className: "symbol" }, "+"),
                        React.createElement("td", null,
                            React.createElement("div", { className: "matrix-header" }, "L1 Weight Updates"),
                            React.createElement(MatrixTable, { matrix: layer1.weightUpdates, colorize: false })))),
                React.createElement("table", { className: "display-table" },
                    React.createElement("tr", null,
                        React.createElement("td", null,
                            React.createElement("div", { className: "matrix-header" }, "New L2 Weights"),
                            React.createElement(MatrixTable, { matrix: MatrixUtil.elementAdd(layer2.weightUpdates, layer2.weights), colorize: true })),
                        React.createElement("td", { className: "symbol" }, "="),
                        React.createElement("td", null,
                            React.createElement("div", { className: "matrix-header" }, "L2 Delta"),
                            React.createElement(MatrixTable, { matrix: layer2.weights, colorize: true })),
                        React.createElement("td", { className: "symbol" }, "+"),
                        React.createElement("td", null,
                            React.createElement("div", { className: "matrix-header" }, "L2 Weight Updates"),
                            React.createElement(MatrixTable, { matrix: layer2.weightUpdates, colorize: false })))))));
    };
    return SingleLayerDisplay;
}(React.Component));
ReactDOM.render(React.createElement(SingleLayerDisplay, null), document.getElementById('root'));


/***/ }),
/* 6 */
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