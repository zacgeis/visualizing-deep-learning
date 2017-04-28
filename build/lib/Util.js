"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
