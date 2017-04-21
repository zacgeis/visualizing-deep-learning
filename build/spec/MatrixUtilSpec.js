"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MatrixUtil = require("../lib/MatrixUtil");
describe('MatrixUtil', function () {
    describe('generateZero', function () {
        it('returns the correct dimensions', function () {
            var matrix = MatrixUtil.generateZero(2, 3);
            var dimensions = MatrixUtil.getDimension(matrix);
            expect(dimensions).toEqual([2, 3]);
        });
    });
    describe('multiply', function () {
        it('returns a correct result', function () {
            var a = [[1, 2, 3], [4, 5, 6]];
            var b = [[7, 8], [9, 10], [11, 12]];
            var expected = [[58, 64], [139, 154]];
            var actual = MatrixUtil.multiply(a, b);
            expect(actual).toEqual(expected);
        });
    });
});
