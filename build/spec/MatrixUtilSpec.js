"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MatrixUtil = require("../lib/MatrixUtil");
describe('MatrixUtil', function () {
    describe('generateZero', function () {
        it('works', function () {
            var matrix = MatrixUtil.generateZero(2, 3);
            var dimensions = MatrixUtil.getDimension(matrix);
            expect(dimensions).toEqual([2, 3]);
        });
    });
    describe('multiply', function () {
        it('works', function () {
            var a = [[1, 2, 3], [4, 5, 6]];
            var b = [[7, 8], [9, 10], [11, 12]];
            var expected = [[58, 64], [139, 154]];
            var actual = MatrixUtil.multiply(a, b);
            expect(actual).toEqual(expected);
        });
    });
    describe('transpose', function () {
        it('works', function () {
            var a = [[1, 2, 3], [4, 5, 6]];
            var expected = [[1, 4], [2, 5], [3, 6]];
            var actual = MatrixUtil.transpose(a);
            expect(actual).toEqual(expected);
        });
    });
    describe('elementAdd', function () {
        it('works', function () {
            var a = [[1, 2, 3], [4, 5, 6]];
            var b = [[3, 2, 0], [-1, -2, -3]];
            var expected = [[4, 4, 3], [3, 3, 3]];
            var actual = MatrixUtil.elementAdd(a, b);
            expect(actual).toEqual(expected);
        });
    });
    describe('elementSubtract', function () {
        it('works', function () {
            var a = [[1, 2, 3], [4, 5, 6]];
            var b = [[3, 2, 0], [-1, -2, -3]];
            var expected = [[-2, 0, 3], [5, 7, 9]];
            var actual = MatrixUtil.elementSubtract(a, b);
            expect(actual).toEqual(expected);
        });
    });
    describe('elementMultiply', function () {
        it('works', function () {
            var a = [[1, 2, 3], [4, 5, 6]];
            var b = [[0, 2, 1], [1, 0, 2]];
            var expected = [[0, 4, 3], [4, 0, 12]];
            var actual = MatrixUtil.elementMultiply(a, b);
            expect(actual).toEqual(expected);
        });
    });
    describe('scalar', function () {
        it('works', function () {
            var a = [[1, 2, 3], [4, 5, 6]];
            var expected = [[3, 6, 9], [12, 15, 18]];
            var actual = MatrixUtil.scalar(3, a);
            expect(actual).toEqual(expected);
        });
    });
    describe('sigmoid', function () {
        it('returns 0.5 when given 0', function () {
            var actual = MatrixUtil.sigmoid(0);
            expect(actual).toEqual(0.5);
        });
        it('returns a numer close to 1 when given 10', function () {
            var actual = MatrixUtil.sigmoid(10);
            expect(actual).toBeGreaterThan(0.9);
            expect(actual).toBeLessThan(1);
        });
        it('returns a numer close to 0 when given -10', function () {
            var actual = MatrixUtil.sigmoid(-10);
            expect(actual).toBeGreaterThan(0);
            expect(actual).toBeLessThan(0.1);
        });
    });
    describe('sigmoidDeriv', function () {
        it('returns a slope of 0.25 when given 0', function () {
            var actual = MatrixUtil.sigmoidDeriv(0);
            expect(actual).toEqual(0.25);
        });
        it('returns a slope close to 0 when given 10', function () {
            var actual = MatrixUtil.sigmoidDeriv(10);
            expect(actual).toBeGreaterThan(0);
            expect(actual).toBeLessThan(0.1);
        });
        it('returns a slope close to 0 when given -10', function () {
            var actual = MatrixUtil.sigmoidDeriv(-10);
            expect(actual).toBeGreaterThan(0);
            expect(actual).toBeLessThan(0.1);
        });
    });
    describe('relu', function () {
        it('returns 0 when given a negative', function () {
            var actual = MatrixUtil.relu(-1);
            expect(actual).toEqual(0);
        });
        it('returns x when given a positive x', function () {
            var actual = MatrixUtil.relu(2);
            expect(actual).toEqual(2);
        });
    });
    describe('reluDeriv', function () {
        it('returns 0 when given a negative', function () {
            var actual = MatrixUtil.reluDeriv(-1);
            expect(actual).toEqual(0);
        });
        it('returns 1 when given a positive x', function () {
            var actual = MatrixUtil.reluDeriv(2);
            expect(actual).toEqual(1);
        });
    });
});
