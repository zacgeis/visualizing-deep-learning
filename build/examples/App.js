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
var Plotly = require("plotly.js");
function weightToStyle(weight) {
    var alpha = (Math.min(100, Math.abs(weight * 25)) / 100).toString().substr(0, 4);
    if (weight < 0) {
        return {
            'background-color': 'rgba(0, 255, 255, ' + alpha + ')'
        };
    }
    return {
        'background-color': 'rgba(255, 150, 0, ' + alpha + ')'
    };
}
function matrixToTable(m, colorize) {
    var rowComponents = [];
    var _a = MatrixUtil.getDimension(m), mRows = _a[0], mCols = _a[1];
    for (var row = 0; row < mRows; row++) {
        var colComponents = [];
        for (var col = 0; col < mCols; col++) {
            var value = m[row][col].toString().substr(0, 8);
            var style = {};
            if (colorize) {
                style = weightToStyle(m[row][col]);
            }
            colComponents.push(React.createElement("td", { style: style }, value));
        }
        rowComponents.push(React.createElement("tr", null, colComponents));
    }
    return (React.createElement("table", { className: "matrix-table" }, rowComponents));
}
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
    PlotData.prototype.render = function (div, title) {
        Plotly.purge(div);
        var layout = {
            width: 480,
            height: 400,
            title: title,
            xaxis: {
                title: 'Iterations'
            }
        };
        var data = this.getPlotlyFormattedData();
        Plotly.newPlot(div, data, layout);
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
        _this.state = {
            value: props.startValue
        };
        _this.handleChange = _this.handleChange.bind(_this);
        return _this;
    }
    IterationSlider.prototype.handleChange = function (event) {
        var value = event.target.value;
        this.setState({ value: value });
        this.props.onIterationChange(value);
    };
    IterationSlider.prototype.render = function () {
        return (React.createElement("div", { className: "iteration-slider" },
            React.createElement("div", null,
                "Iteration (of ",
                this.props.max,
                "): ",
                this.state.value),
            React.createElement("input", { type: "range", onChange: this.handleChange, min: this.props.min, max: this.props.max, value: this.state.value, step: "1" })));
    };
    return IterationSlider;
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
            learningRate: this.state.tempLearningRate,
            networkState: newState,
            hiddenLayerSize: this.state.tempHiddenLayerSize
        });
        newState.plotData.render('error-plot', 'Error');
    };
    SingleLayerDisplay.prototype.componentDidMount = function () {
        this.state.networkState.plotData.render('error-plot', 'Error');
    };
    SingleLayerDisplay.prototype.render = function () {
        var layer1 = this.state.networkState.iterations[this.state.iteration][0];
        var layer2 = this.state.networkState.iterations[this.state.iteration][1];
        var finalError = this.state.networkState.finalError;
        return (React.createElement("div", null,
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
            React.createElement(IterationSlider, { min: 0, max: this.state.count, startValue: this.state.iteration, onIterationChange: this.handleIterationChange }),
            React.createElement("table", { className: "display-table" },
                React.createElement("tr", null,
                    React.createElement("td", null,
                        React.createElement("div", { className: "matrix-header" }, "Forward Layer 1")),
                    React.createElement("td", null,
                        React.createElement("div", { className: "matrix-header" }, "Inputs"),
                        matrixToTable(this.state.networkState.inputData, false)),
                    React.createElement("td", null,
                        React.createElement("div", { className: "matrix-header" }, "Weights"),
                        matrixToTable(layer1.weights, true)),
                    React.createElement("td", null,
                        React.createElement("div", { className: "matrix-header" }, "Weighted Sum"),
                        matrixToTable(layer1.hiddenSum, false)),
                    React.createElement("td", null,
                        React.createElement("div", { className: "matrix-header" }, "Output"),
                        matrixToTable(layer1.hiddenResult, false)))),
            React.createElement("table", { className: "display-table" },
                React.createElement("tr", null,
                    React.createElement("td", null,
                        React.createElement("div", { className: "matrix-header" }, "Forward Layer 2")),
                    React.createElement("td", null,
                        React.createElement("div", { className: "matrix-header" }, "Inputs (Layer 1 Output)"),
                        matrixToTable(layer1.hiddenResult, false)),
                    React.createElement("td", null,
                        React.createElement("div", { className: "matrix-header" }, "Weights"),
                        matrixToTable(layer2.weights, true)),
                    React.createElement("td", null,
                        React.createElement("div", { className: "matrix-header" }, "Weighted Sum"),
                        matrixToTable(layer2.hiddenSum, false)),
                    React.createElement("td", null,
                        React.createElement("div", { className: "matrix-header" }, "Output"),
                        matrixToTable(layer2.hiddenResult, false)),
                    React.createElement("td", null,
                        React.createElement("div", { className: "matrix-header" }, "Target Output"),
                        matrixToTable(this.state.networkState.outputTarget, false)))),
            React.createElement("table", { className: "display-table" },
                React.createElement("tr", null,
                    React.createElement("td", null,
                        React.createElement("div", { className: "matrix-header" }, "Back Prop Layer 2")),
                    React.createElement("td", null,
                        React.createElement("div", { className: "matrix-header" }, "Error"),
                        matrixToTable(layer2.error, false)),
                    React.createElement("td", null,
                        React.createElement("div", { className: "matrix-header" }, "Gradients"),
                        matrixToTable(layer2.gradients, false)),
                    React.createElement("td", null,
                        React.createElement("div", { className: "matrix-header" }, "Delta"),
                        matrixToTable(layer2.delta, false)),
                    React.createElement("td", null,
                        React.createElement("div", { className: "matrix-header" }, "Weight Updates"),
                        matrixToTable(layer2.weightUpdates, false)))),
            React.createElement("table", { className: "display-table" },
                React.createElement("tr", null,
                    React.createElement("td", null,
                        React.createElement("div", { className: "matrix-header" }, "Back Prop Layer 1")),
                    React.createElement("td", null,
                        React.createElement("div", { className: "matrix-header" }, "Error"),
                        matrixToTable(layer1.error, false)),
                    React.createElement("td", null,
                        React.createElement("div", { className: "matrix-header" }, "Gradients"),
                        matrixToTable(layer1.gradients, false)),
                    React.createElement("td", null,
                        React.createElement("div", { className: "matrix-header" }, "Delta"),
                        matrixToTable(layer1.delta, false)),
                    React.createElement("td", null,
                        React.createElement("div", { className: "matrix-header" }, "Weight Updates"),
                        matrixToTable(layer1.weightUpdates, false)))),
            React.createElement("div", { id: "error-plot" })));
    };
    return SingleLayerDisplay;
}(React.Component));
ReactDOM.render(React.createElement(SingleLayerDisplay, null), document.getElementById('root'));
