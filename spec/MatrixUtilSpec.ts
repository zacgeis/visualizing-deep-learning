import * as MatrixUtil from "../lib/MatrixUtil";

describe('MatrixUtil', () => {
  describe('generateZero', () => {
    it('returns the correct dimensions', () => {
      let matrix = MatrixUtil.generateZero(2, 3);
      let dimensions = MatrixUtil.getDimension(matrix);
      expect(dimensions).toEqual([2, 3]);
    });
  });
  describe('multiply', () => {
    it('returns a correct result', () => {
      let a = [[1, 2, 3], [4, 5, 6]];
      let b = [[7, 8], [9, 10], [11, 12]];
      let expected = [[58, 64], [139, 154]];
      let actual = MatrixUtil.multiply(a, b);
      expect(actual).toEqual(expected);
    });
  });
});
