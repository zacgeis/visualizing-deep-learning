import * as Util from "../lib/Util";

describe('Util', () => {
  describe('sigmoid', () => {
    it('returns 0.5 when given 0', () => {
      let actual = Util.sigmoid(0);
      expect(actual).toEqual(0.5);
    });
    it('returns a numer close to 1 when given 10', () => {
      let actual = Util.sigmoid(10);
      expect(actual).toBeGreaterThan(0.9);
      expect(actual).toBeLessThan(1);
    });
    it('returns a numer close to 0 when given -10', () => {
      let actual = Util.sigmoid(-10);
      expect(actual).toBeGreaterThan(0);
      expect(actual).toBeLessThan(0.1);
    });
  });

  describe('sigmoidDeriv', () => {
    it('returns a slope of 0.25 when given 0', () => {
      let actual = Util.sigmoidDeriv(0);
      expect(actual).toEqual(0.25);
    });
    it('returns a slope close to 0 when given 10', () => {
      let actual = Util.sigmoidDeriv(10);
      expect(actual).toBeGreaterThan(0);
      expect(actual).toBeLessThan(0.1);
    });
    it('returns a slope close to 0 when given -10', () => {
      let actual = Util.sigmoidDeriv(-10);
      expect(actual).toBeGreaterThan(0);
      expect(actual).toBeLessThan(0.1);
    });
  });

  describe('relu', () => {
    it('returns 0 when given a negative', () => {
      let actual = Util.relu(-1);
      expect(actual).toEqual(0);
    });
    it('returns x when given a positive x', () => {
      let actual = Util.relu(2);
      expect(actual).toEqual(2);
    });
  });

  describe('reluDeriv', () => {
    it('returns 0 when given a negative', () => {
      let actual = Util.reluDeriv(-1);
      expect(actual).toEqual(0);
    });
    it('returns 1 when given a positive x', () => {
      let actual = Util.reluDeriv(2);
      expect(actual).toEqual(1);
    });
  });
});
