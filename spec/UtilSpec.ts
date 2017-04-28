import * as Util from "../lib/Util";

describe('Activation', () => {
  describe('sigmoid', () => {
    it('works', () => {
      let actual = Util.Activation.sigmoid(1);
      expect(actual).toEqual(0);
    });
  });
  describe('sigmoidDeriv', () => {
    it('works', () => {
    });
  });
});
