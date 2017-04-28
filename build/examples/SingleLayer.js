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
    console.log('=== Iteration ' + i + ' ===');
    MatrixUtil.display('Weights:', weights);
    var hiddenSum = MatrixUtil.multiply(inputData, weights);
    var hiddenResult = MatrixUtil.mapOneToOne(hiddenSum, Util.sigmoid);
    MatrixUtil.display('Output: ', hiddenResult);
    var error = MatrixUtil.elementSubtract(outputTarget, hiddenResult);
    MatrixUtil.display('Error:', error);
    var gradients = MatrixUtil.mapOneToOne(hiddenSum, Util.sigmoidDeriv);
    MatrixUtil.display('Gradients:', gradients);
    var delta = MatrixUtil.scalar(learningRate, MatrixUtil.elementMultiply(gradients, error));
    MatrixUtil.display('Delta:', delta);
    var weightUpdates = MatrixUtil.multiply(MatrixUtil.transpose(inputData), delta);
    MatrixUtil.display('Weight Updates:', weightUpdates);
    weights = MatrixUtil.elementAdd(weightUpdates, weights);
}
