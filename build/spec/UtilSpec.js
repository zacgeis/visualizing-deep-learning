"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Util = require("../lib/Util");
describe('Activation', function () {
    describe('sigmoid', function () {
        it('works', function () {
            var actual = Util.Activation.sigmoid(1);
            expect(actual).toEqual(0);
        });
    });
    describe('sigmoidDeriv', function () {
        it('works', function () {
        });
    });
});
