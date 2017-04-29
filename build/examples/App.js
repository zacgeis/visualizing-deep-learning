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
var Util = require("../lib/Util");
var MatrixUtil = require("../lib/MatrixUtil");
var katex = require("katex");
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
    return (React.createElement("table", { className: "matrix-table" }, rowComponents));
}
function generateNetworkState(count, learningRate) {
    var inputData = [
        [0, 0, 1],
        [0, 1, 1],
        [1, 0, 1],
        [1, 1, 1],
    ];
    var outputTarget = [
        [0],
        [0],
        [1],
        [1],
    ];
    var weights = MatrixUtil.generateRandom(3, 1);
    var iterations = [];
    for (var i = 0; i <= count; i++) {
        var hiddenSum = MatrixUtil.multiply(inputData, weights);
        var hiddenResult = MatrixUtil.mapOneToOne(hiddenSum, Util.sigmoid);
        var error = MatrixUtil.elementSubtract(outputTarget, hiddenResult);
        var gradients = MatrixUtil.mapOneToOne(hiddenSum, Util.sigmoidDeriv);
        var delta = MatrixUtil.scalar(learningRate, MatrixUtil.elementMultiply(gradients, error));
        var weightUpdates = MatrixUtil.multiply(MatrixUtil.transpose(inputData), delta);
        iterations.push({
            weights: weights,
            hiddenSum: hiddenSum,
            hiddenResult: hiddenResult,
            error: error,
            gradients: gradients,
            delta: delta,
            weightUpdates: weightUpdates
        });
        weights = MatrixUtil.elementAdd(weightUpdates, weights);
    }
    return {
        learningRate: learningRate,
        inputData: inputData,
        outputTarget: outputTarget,
        iterations: iterations
    };
}
var IterationSlider = (function (_super) {
    __extends(IterationSlider, _super);
    function IterationSlider(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            value: props.min
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
        _this.state = {
            networkState: generateNetworkState(defaultCount, defaultLearningRate),
            learningRate: defaultLearningRate,
            count: defaultCount,
            tempLearningRate: defaultLearningRate,
            tempCount: defaultCount,
            iteration: 0
        };
        _this.handleIterationChange = _this.handleIterationChange.bind(_this);
        _this.handleLearningRateChange = _this.handleLearningRateChange.bind(_this);
        _this.handleIterationCountChange = _this.handleIterationCountChange.bind(_this);
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
    SingleLayerDisplay.prototype.handleGenerate = function () {
        this.setState({
            count: this.state.tempCount,
            learningRate: this.state.tempLearningRate,
            networkState: generateNetworkState(this.state.tempCount, this.state.tempLearningRate)
        });
    };
    // TODO: show equations with values filled in.
    // TODO: show graphs.
    SingleLayerDisplay.prototype.render = function () {
        var currentIteration = this.state.networkState.iterations[this.state.iteration];
        var test = { __html: katex.renderToString("c = \\pm\\sqrt{a^2 + b^2}") };
        return (React.createElement("div", null,
            React.createElement("div", { className: "input-section" },
                React.createElement("div", { className: "input-field" },
                    "Learning Rate: ",
                    React.createElement("input", { value: this.state.tempLearningRate, onInput: this.handleLearningRateChange })),
                React.createElement("div", { className: "input-field" },
                    "Iteration Count: ",
                    React.createElement("input", { value: this.state.tempCount, onInput: this.handleIterationCountChange })),
                React.createElement("button", { className: "generate-button", onClick: this.handleGenerate }, "Generate")),
            React.createElement("div", { className: "display-field" },
                "Learning Rate: ",
                this.state.learningRate),
            React.createElement("div", { className: "display-field" },
                "Iteration Count: ",
                this.state.count),
            React.createElement(IterationSlider, { min: 0, max: this.state.count, onIterationChange: this.handleIterationChange }),
            React.createElement("table", { className: "display-table" },
                React.createElement("tr", null,
                    React.createElement("td", null,
                        React.createElement("div", { className: "matrix-header" }, "Forward")),
                    React.createElement("td", null,
                        React.createElement("div", { className: "matrix-header" }, "Inputs"),
                        matrixToTable(this.state.networkState.inputData)),
                    React.createElement("td", null,
                        React.createElement("div", { className: "matrix-header" }, "Weights"),
                        matrixToTable(currentIteration.weights)),
                    React.createElement("td", null,
                        React.createElement("div", { className: "matrix-header" }, "Hidden Sum"),
                        matrixToTable(currentIteration.hiddenSum)),
                    React.createElement("td", null,
                        React.createElement("div", { className: "matrix-header" }, "Output"),
                        matrixToTable(currentIteration.hiddenResult)),
                    React.createElement("td", null,
                        React.createElement("div", { className: "matrix-header" }, "Target Output"),
                        matrixToTable(this.state.networkState.outputTarget)))),
            React.createElement("table", { className: "display-table" },
                React.createElement("tr", null,
                    React.createElement("td", null,
                        React.createElement("div", { className: "matrix-header" }, "Back Prop")),
                    React.createElement("td", null,
                        React.createElement("div", { className: "matrix-header" }, "Error"),
                        matrixToTable(currentIteration.error)),
                    React.createElement("td", null,
                        React.createElement("div", { className: "matrix-header" }, "Gradients"),
                        matrixToTable(currentIteration.gradients)),
                    React.createElement("td", null,
                        React.createElement("div", { className: "matrix-header" }, "Delta"),
                        matrixToTable(currentIteration.delta)),
                    React.createElement("td", null,
                        React.createElement("div", { className: "matrix-header" }, "Weight Updates"),
                        matrixToTable(currentIteration.weightUpdates)))),
            React.createElement("div", { dangerouslySetInnerHTML: test })));
    };
    return SingleLayerDisplay;
}(React.Component));
ReactDOM.render(React.createElement(SingleLayerDisplay, null), document.getElementById('root'));
