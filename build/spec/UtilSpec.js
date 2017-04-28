"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Util = require("../lib/Util");
describe('Util', function () {
    describe('sigmoid', function () {
        it('returns 0.5 when given 0', function () {
            var actual = Util.sigmoid(0);
            expect(actual).toEqual(0.5);
        });
        it('returns a numer close to 1 when given 10', function () {
            var actual = Util.sigmoid(10);
            expect(actual).toBeGreaterThan(0.9);
            expect(actual).toBeLessThan(1);
        });
        it('returns a numer close to 0 when given -10', function () {
            var actual = Util.sigmoid(-10);
            expect(actual).toBeGreaterThan(0);
            expect(actual).toBeLessThan(0.1);
        });
    });
    describe('sigmoidDeriv', function () {
        it('returns a slope of 0.25 when given 0', function () {
            var actual = Util.sigmoidDeriv(0);
            expect(actual).toEqual(0.25);
        });
        it('returns a slope close to 0 when given 10', function () {
            var actual = Util.sigmoidDeriv(10);
            expect(actual).toBeGreaterThan(0);
            expect(actual).toBeLessThan(0.1);
        });
        it('returns a slope close to 0 when given -10', function () {
            var actual = Util.sigmoidDeriv(-10);
            expect(actual).toBeGreaterThan(0);
            expect(actual).toBeLessThan(0.1);
        });
    });
    describe('relu', function () {
        it('returns 0 when given a negative', function () {
            var actual = Util.relu(-1);
            expect(actual).toEqual(0);
        });
        it('returns x when given a positive x', function () {
            var actual = Util.relu(2);
            expect(actual).toEqual(2);
        });
    });
    describe('reluDeriv', function () {
        it('returns 0 when given a negative', function () {
            var actual = Util.reluDeriv(-1);
            expect(actual).toEqual(0);
        });
        it('returns 1 when given a positive x', function () {
            var actual = Util.reluDeriv(2);
            expect(actual).toEqual(1);
        });
    });
});
