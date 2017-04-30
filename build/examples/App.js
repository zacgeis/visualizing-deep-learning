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
var React = require("react");
var ReactDOM = require("react-dom");
var MatrixUtil = require("../lib/MatrixUtil");
var katex = require("katex");
var Plotly = require("plotly.js");
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
        var transpose = [['x11', 'x21'], ['x12', 'x22'], ['x21', 'x23']];
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
            React.createElement("h3", { className: "math-intro-header" }, "Brief Function Guide:"),
            React.createElement("h4", { className: "math-intro-label" }, "Sigmoid:"),
            React.createElement("table", { className: "display-table" },
                React.createElement("tr", null,
                    React.createElement("td", null,
                        React.createElement("div", { className: "math", ref: function (input) { _this.sigmoidElement = input; } })))),
            React.createElement("h4", { className: "math-intro-label" }, "Sigmoid's First Derivative:"),
            React.createElement("table", { className: "display-table" },
                React.createElement("tr", null,
                    React.createElement("td", null,
                        React.createElement("div", { className: "math", ref: function (input) { _this.sigmoidDerivElement = input; } })))),
            React.createElement("h4", { className: "math-intro-label" }, "Matrix Element-Wise Operations"),
            React.createElement("div", { className: "math-intro-label-sub" }, "This applies to all basic arithmetic operations"),
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
            React.createElement("h4", { className: "math-intro-label" }, "Matrix Multiplication"),
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
            React.createElement("h4", { className: "math-intro-label" }, "Matrix Scalar"),
            React.createElement("table", { className: "display-table" },
                React.createElement("tr", null,
                    React.createElement("td", null, "a"),
                    React.createElement("td", { className: "symbol" }, "\u00B7"),
                    React.createElement("td", null,
                        React.createElement(MatrixTable, { matrix: x22, colorize: false, fullString: true })),
                    React.createElement("td", { className: "symbol" }, "="),
                    React.createElement("td", null,
                        React.createElement(MatrixTable, { matrix: adot, colorize: false, fullString: true })))),
            React.createElement("h4", { className: "math-intro-label" }, "Matrix Transpose"),
            React.createElement("table", { className: "display-table" },
                React.createElement("tr", null,
                    React.createElement("td", { className: "symbol" }, "T("),
                    React.createElement("td", null,
                        React.createElement(MatrixTable, { matrix: x23, colorize: false, fullString: true })),
                    React.createElement("td", { className: "symbol" }, ")="),
                    React.createElement("td", null,
                        React.createElement(MatrixTable, { matrix: transpose, colorize: false, fullString: true })))),
            React.createElement("h4", { className: "math-intro-label" }, "Matrix Element-Wise Apply"),
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
            React.createElement("h3", null, "Interactive Network:"),
            React.createElement("div", { className: "input-section" },
                React.createElement("div", { className: "input-field" },
                    "Hidden Neuron Count: ",
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
                            "Hidden Neuron Count: ",
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
                        React.createElement("td", { className: "symbol" }, ")")))),
            React.createElement("div", { className: "section" },
                React.createElement("div", { className: "section-header" }, "Back Propagation Pass: "),
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
                            React.createElement(MatrixTable, { matrix: layer2.hiddenResult, colorize: false })))),
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
                            " \u00B7 (T("),
                        React.createElement("td", null,
                            React.createElement("div", { className: "matrix-header" }, "Inputs"),
                            React.createElement(MatrixTable, { matrix: this.state.networkState.inputData, colorize: false })),
                        React.createElement("td", { className: "symbol" }, ")\u00B7"),
                        React.createElement("td", null,
                            React.createElement("div", { className: "matrix-header" }, "L1 Delta"),
                            React.createElement(MatrixTable, { matrix: layer1.delta, colorize: false })),
                        React.createElement("td", { className: "symbol" }, ")"))),
                React.createElement("table", { className: "display-table" },
                    React.createElement("tr", null,
                        React.createElement("td", null,
                            React.createElement("div", { className: "matrix-header" }, "L2 Weight Updates"),
                            React.createElement(MatrixTable, { matrix: layer2.weightUpdates, colorize: false })),
                        React.createElement("td", { className: "symbol" },
                            "= ",
                            this.state.learningRate,
                            " \u00B7 (T("),
                        React.createElement("td", null,
                            React.createElement("div", { className: "matrix-header" }, "L1 Output"),
                            React.createElement(MatrixTable, { matrix: layer1.hiddenResult, colorize: false })),
                        React.createElement("td", { className: "symbol" }, ")\u00B7"),
                        React.createElement("td", null,
                            React.createElement("div", { className: "matrix-header" }, "L2 Delta"),
                            React.createElement(MatrixTable, { matrix: layer2.delta, colorize: false })),
                        React.createElement("td", { className: "symbol" }, ")"))),
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
