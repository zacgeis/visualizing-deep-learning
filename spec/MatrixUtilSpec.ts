import * as MatrixUtil from "../lib/MatrixUtil";

describe('MatrixUtil', () => {
  describe('generateZero', () => {
    it('works', () => {
      let matrix = MatrixUtil.generateZero(2, 3);
      let dimensions = MatrixUtil.getDimension(matrix);
      expect(dimensions).toEqual([2, 3]);
    });
  });
  describe('multiply', () => {
    it('works', () => {
      let a = [[1, 2, 3], [4, 5, 6]];
      let b = [[7, 8], [9, 10], [11, 12]];
      let expected = [[58, 64], [139, 154]];
      let actual = MatrixUtil.multiply(a, b);
      expect(actual).toEqual(expected);
    });
  });
  describe('transpose', () => {
    it('works', () => {
      let a = [[1, 2, 3], [4, 5, 6]];
      let expected = [[1, 4], [2, 5], [3, 6]];
      let actual = MatrixUtil.transpose(a);
      expect(actual).toEqual(expected);
    });
  });
});
