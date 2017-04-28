"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Activation;
(function (Activation) {
    function sigmoid(x) {
        return 1 / (1 + Math.exp(-x));
    }
    Activation.sigmoid = sigmoid;
    function sigmoidDeriv(x) {
        return sigmoid(x) * (1 - sigmoid(x));
    }
    Activation.sigmoidDeriv = sigmoidDeriv;
    function relu(x) {
        if (x > 0) {
            return x;
        }
        else {
            return 0;
        }
    }
    Activation.relu = relu;
    function reluDeriv(x) {
        if (x < 0) {
            return 1;
        }
        else {
            return 0;
        }
    }
    Activation.reluDeriv = reluDeriv;
})(Activation = exports.Activation || (exports.Activation = {}));
