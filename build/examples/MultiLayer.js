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
    [1],
    [1],
    [0],
];
// without an additional layer, the resulsts just settle at 0.5 across.
var learningRate = 0.1;
var weights1 = MatrixUtil.generateRandom(3, 4);
var weights2 = MatrixUtil.generateRandom(4, 1);
for (var i = 0; i < 10000; i++) {
    var hiddenSum1 = MatrixUtil.multiply(inputData, weights1);
    var hiddenResult1 = MatrixUtil.mapOneToOne(hiddenSum1, Util.sigmoid);
    var hiddenSum2 = MatrixUtil.multiply(hiddenResult1, weights2);
    var hiddenResult2 = MatrixUtil.mapOneToOne(hiddenSum2, Util.sigmoid);
    MatrixUtil.display('Output: ', hiddenResult2);
    var error2 = MatrixUtil.elementSubtract(outputTarget, hiddenResult2);
    var gradients2 = MatrixUtil.mapOneToOne(hiddenSum2, Util.sigmoidDeriv);
    var delta2 = MatrixUtil.elementMultiply(gradients2, error2);
    var error1 = MatrixUtil.multiply(delta2, MatrixUtil.transpose(weights2));
    var gradients1 = MatrixUtil.mapOneToOne(hiddenSum1, Util.sigmoidDeriv);
    var delta1 = MatrixUtil.elementMultiply(gradients1, error1);
    var weight1Updates = MatrixUtil.scalar(learningRate, MatrixUtil.multiply(MatrixUtil.transpose(inputData), delta1));
    var weight2Updates = MatrixUtil.scalar(learningRate, MatrixUtil.multiply(MatrixUtil.transpose(hiddenResult1), delta2));
    weights1 = MatrixUtil.elementAdd(weight1Updates, weights1);
    weights2 = MatrixUtil.elementAdd(weight2Updates, weights2);
}
