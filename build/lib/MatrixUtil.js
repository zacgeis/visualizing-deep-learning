"use strict";
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
