// print('error', matrix_sum_squared_error(hidden_result, output_target))
// print('error', error)
// print('result', hidden_result)
// print('grad', gradients)
// print('delta', delta)
// print('weights', weights)
// print()
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Util = require("../lib/Util");
var MatrixUtil = require("../lib/MatrixUtil");
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
var learningRate = 0.1;
var weights = MatrixUtil.generateRandom(3, 1);
for (var i = 0; i < 2000; i++) {
    var hiddenSum = MatrixUtil.multiply(inputData, weights);
    var hiddenResult = MatrixUtil.mapOneToOne(hiddenSum, Util.sigmoid);
    var error = MatrixUtil.elementSubtract(outputTarget, hiddenResult);
    var gradients = MatrixUtil.mapOneToOne(hiddenSum, Util.sigmoidDeriv);
    var delta = MatrixUtil.scalar(learningRate, MatrixUtil.elementMultiply(gradients, error));
    var weightUpdates = MatrixUtil.multiply(MatrixUtil.transpose(inputData), delta);
    weights = MatrixUtil.elementAdd(weightUpdates, weights);
    console.log(hiddenResult);
}
